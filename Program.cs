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
using ZombieLynxPortalAPI.Services.Minecraft;
using ZombieLynxPortalAPI.Data.Ark;
using ZombieLynxPortalAPI.Services.Email;
using Microsoft.Extensions.FileProviders;
using Serilog;
using Serilog.Events;


Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Override("Default", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.EntityFrameworkCore.Database.Command", LogEventLevel.Fatal)
    .MinimumLevel.Override("System.Net.Http.HttpClient", LogEventLevel.Fatal)
    .Enrich.FromLogContext()
    // .WriteTo.Console()
    .WriteTo.File(
        "Logs/log-.txt",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 7,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss} [{Level:u3}] {Message:lj}{NewLine}{Exception}"
    )
    .CreateLogger();


var builder = WebApplication.CreateBuilder(args);

builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();


builder.Host.UseSerilog();


// Add services to the container.
builder.Services.AddControllers();
builder.Services.Configure<PointsDatabaseOptions>(
    builder.Configuration.GetSection("PointsDatabaseOptions"));
builder.Services.AddSingleton<PointsDbConnectionService>();
//Add services for HttpClient
builder.Services.AddHttpClient();
// Add services for Tebex
builder.Services.AddScoped<TebexOrderProcessor>();
// Add Services for Ark
builder.Services.AddScoped<ArkPointsSyncService>();
builder.Services.AddHostedService<ArkPointsSyncWorker>();
builder.Services.AddScoped<ArkSubscriptionSyncService>();
// Add Services for Asa
builder.Services.AddScoped<AsaPointsSyncService>();
builder.Services.AddHostedService<AsaPointsSyncWorker>();
builder.Services.AddScoped<AsaSubscriptionSyncService>();
// Add Services for Minecraft
builder.Services.AddScoped<MinecraftPointsSyncService>();
builder.Services.AddHostedService<MinecraftPointsSyncWorker>();
builder.Services.AddScoped<MinecraftSubscriptionSyncService>();
// Add Email Sender Service
builder.Services.AddScoped<IEmailSender, SmtpEmailSender>();


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

    options.UseMySQL(connectionString, mySqlOptions =>
    {
        mySqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorNumbersToAdd: null
        );
    });
});

// Configure MySQL for ArkLink
builder.Services.AddDbContext<ArkLinkPointsDbContext>((serviceProvider, options) =>
{
    var connService = serviceProvider.GetRequiredService<PointsDbConnectionService>();
    var connectionString = connService.GetConnectionString("ArkShop");

    options.UseMySQL(connectionString, mySqlOptions =>
    {
        mySqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorNumbersToAdd: null
        );
    });
});


// Configure MySQL for AsaShop
builder.Services.AddDbContext<AsaShopDbContext>((serviceProvider, options) =>
{
    var connService = serviceProvider.GetRequiredService<PointsDbConnectionService>();
    var connectionString = connService.GetConnectionString("AsaShop");

    options.UseMySQL(connectionString, mySqlOptions =>
{
    mySqlOptions.EnableRetryOnFailure(
        maxRetryCount: 5,
        maxRetryDelay: TimeSpan.FromSeconds(10),
        errorNumbersToAdd: null
    );
});
});

// Configure MySQL for AsaLink
builder.Services.AddDbContext<AsaLinkPointsDbContext>((serviceProvider, options) =>
{
    var connService = serviceProvider.GetRequiredService<PointsDbConnectionService>();
    var connectionString = connService.GetConnectionString("AsaShop");

    options.UseMySQL(connectionString, mySqlOptions =>
    {
        mySqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorNumbersToAdd: null
        );
    });
});

// Configure MySQL for MinecraftPoints
builder.Services.AddDbContext<MinecraftPointsDbContext>((serviceProvider, options) =>
{
    var connService = serviceProvider.GetRequiredService<PointsDbConnectionService>();
    var connectionString = connService.GetConnectionString("MinecraftPoints");

    options.UseMySQL(connectionString, mySqlOptions =>
{
    mySqlOptions.EnableRetryOnFailure(
        maxRetryCount: 5,
        maxRetryDelay: TimeSpan.FromSeconds(10),
        errorNumbersToAdd: null
    );
});

});

// Configure MySQL for MinecraftLink
builder.Services.AddDbContext<MinecraftLinkPointsDbContext>((serviceProvider, options) =>
{
    var connService = serviceProvider.GetRequiredService<PointsDbConnectionService>();
    var connectionString = connService.GetConnectionString("MinecraftPoints");

    options.UseMySQL(connectionString, mySqlOptions =>
    {
        mySqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorNumbersToAdd: null
        );
    });
});


// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins(
                "http://localhost:5174",
                "https://zlg.gg"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
    );
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
        Log.Error(ex, "💥 Unhandled exception during request.");
        await context.Response.WriteAsync("Something went wrong.");
    }
});


// app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

// ✅ Force .NET to serve from the correct wwwroot folder
// app.UseStaticFiles(new StaticFileOptions
// {
//     FileProvider = new PhysicalFileProvider(
//         Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")),
//     RequestPath = ""
// });

app.UseDefaultFiles();
app.UseStaticFiles();
app.MapFallbackToFile("index.html");

app.MapControllers();


// ✅ Bind to all network interfaces
app.Urls.Add("http://0.0.0.0:5001");
app.Urls.Add("http://0.0.0.0:5000");
app.Urls.Add("https://localhost:5001");


// ✅ Start <GameName>PointsSyncService after app startup
using (var scope = app.Services.CreateScope())
{
    var arkSync = scope.ServiceProvider.GetRequiredService<ArkPointsSyncService>();
    await arkSync.SyncPendingPointsAsync();

    var asaSync = scope.ServiceProvider.GetRequiredService<AsaPointsSyncService>();
    await asaSync.SyncPendingPointsAsync();

    var minecraftSync = scope.ServiceProvider.GetRequiredService<MinecraftPointsSyncService>();
    await minecraftSync.SyncPendingPointsAsync();
}


app.Run();

