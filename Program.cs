using Microsoft.EntityFrameworkCore;
using MySql.EntityFrameworkCore.Extensions;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using ZombieLynxPortalAPI.Data;
using AspNet.Security.OpenId.Steam;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using ZombieLynxPortalAPI.Services.Tebex;
using ZombieLynxPortalAPI.Models;
using ZombieLynxPortalAPI.Services;
using ZombieLynxPortalAPI.Services.Ark;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();


builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.Configure<PointsDatabaseOptions>(
    builder.Configuration.GetSection("PointsDatabaseOptions"));
builder.Services.AddSingleton<PointsDbConnectionService>();
builder.Services.AddHttpClient();
builder.Services.AddScoped<TebexOrderProcessor>();
builder.Services.AddScoped<ArkPointsSyncService>();
builder.Services.AddHostedService<ArkPointsSyncWorker>();

// Configure PostgreSQL
builder.Services.AddDbContext<ZombieLynxPortalAPIDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
           .ConfigureWarnings(warnings =>
               warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning))
);

// Configure MySQL for ArkShop
builder.Services.AddDbContext<ArkShopDbContext>((serviceProvider, options) =>
{
    var connService = serviceProvider.GetRequiredService<PointsDbConnectionService>();
    var connectionString = connService.GetConnectionString("ArkShop");

    options.UseMySQL(connectionString);
});


// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost",
        policy => policy
            .SetIsOriginAllowed(origin =>
                new Uri(origin).Host == "localhost")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

    options.DefaultSignInScheme = "Cookies";
})
.AddCookie("Cookies", options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.None;
    options.ExpireTimeSpan = TimeSpan.FromMinutes(60);
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!))
    };
})
.AddSteam(options =>
{
    options.ApplicationKey = builder.Configuration["Authentication:Steam:ApiKey"];
    options.CallbackPath = "/api/SteamAuth/link-steam";  // ✅ Ensure this matches the Steam dashboard

    options.Events.OnRedirectToIdentityProvider = context =>
{
    // ✅ Correct Steam OpenID login URL
    var redirectUrl = $"https://steamcommunity.com/openid/login" +
                      $"?openid.ns=http://specs.openid.net/auth/2.0" +
                      $"&openid.mode=checkid_setup" +
                      $"&openid.return_to={Uri.EscapeDataString(context.Properties.RedirectUri ?? string.Empty)}" +  // ✅ Fixed this line
                      $"&openid.realm={Uri.EscapeDataString($"{context.Request.Scheme}://{context.Request.Host}")}" +
                      $"&openid.identity=http://specs.openid.net/auth/2.0/identifier_select" +
                      $"&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select";

    context.Response.Redirect(redirectUrl);
    return Task.CompletedTask;
};


    options.Events.OnRemoteFailure = context =>
    {
        context.Response.Redirect($"/error?message={Uri.EscapeDataString(context.Failure?.Message ?? "Unknown error")}");
        context.HandleResponse();
        return Task.CompletedTask;
    };
});



// Configure Authorization Policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("UserOnly", policy => policy.RequireRole("User"));
});

// Add Swagger Documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "ZombieLynxPortalAPI", Version = "v1" });

    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT token like this: Bearer {your token}"
    };

    c.AddSecurityDefinition("Bearer", securityScheme);

    var securityRequirement = new OpenApiSecurityRequirement
    {
        { securityScheme, new[] { "Bearer" } }
    };

    c.AddSecurityRequirement(securityRequirement);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ZombieLynxPortal API V1");
        // c.RoutePrefix = string.Empty;
    });
}

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";

        var errorFeature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>();
        if (errorFeature != null)
        {
            var error = errorFeature.Error;
            await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(new
            {
                context.Response.StatusCode,
                Message = "Internal Server Error.",
                Detailed = error.Message
            }));
        }
    });
});

app.Use(async (context, next) =>
{
    try
    {
        await next.Invoke();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"💥 Unhandled exception: {ex.Message}");
        await context.Response.WriteAsync("Something went wrong.");
    }
});


// app.UseHttpsRedirection();
app.UseCors("AllowLocalhost");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// ✅ Bind to all network interfaces
app.Urls.Add("http://0.0.0.0:5000");
app.Urls.Add("https://localhost:5001");


// ✅ Start ArkPointsSyncService after app startup
using (var scope = app.Services.CreateScope())
{
    var syncService = scope.ServiceProvider.GetRequiredService<ArkPointsSyncService>();
    await syncService.SyncPendingPointsAsync();
}

app.Run();

