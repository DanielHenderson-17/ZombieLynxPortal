# ZombieLynx Portal Deployment Guide

## Prerequisites

- AMP CubeCoders installed and configured
- Git repository set to `deployment` branch
- AMP Dotnet App Runner configured with:
  - **App Compilation Mode**: `Publish (default)`
  - **App Compilation Arguments**: `-c Release -o publish`
  - **App Compilation Target**: `ZombieLynxPortalAPI.sln`
  - **App Build Name**: `ZombieLynxPortalAPI.dll`
  - **App Build Location**: `publish`

## Deployment Steps

### 1. Clean the App Folder

Delete all contents in:

```
C:\AMPDatastore\Instances\ZLG-Portal01\dotnet-app-runner\app\
```

### 2. Update AMP Instance

In AMP panel:

- Navigate to **Updates** → Click **Update Application**
- Wait for the update to complete (pulls repo, runs `dotnet publish`, builds client)

### 3. Copy Required Files

Copy these files/folders to the `publish` directory:

**From another PC or backup:**

- `Config/battlepass.yaml` → `publish/Config/battlepass.yaml`
- `appsettings.json` → `publish/appsettings.json`
- `appsettings.Production.json` → `publish/appsettings.Production.json` (if needed)

**From app folder:**

- `wwwroot/` → `publish/wwwroot/`

**PowerShell commands (run from app folder):**

```powershell
# Create Config directory if it doesn't exist
New-Item -ItemType Directory -Path "publish\Config" -Force

# Copy wwwroot
Copy-Item -Path "wwwroot" -Destination "publish\wwwroot" -Recurse -Force

# Copy config files (after placing them in the app folder)
Copy-Item -Path "Config\battlepass.yaml" -Destination "publish\Config\battlepass.yaml" -Force
Copy-Item -Path "appsettings.json" -Destination "publish\appsettings.json" -Force
Copy-Item -Path "appsettings.Production.json" -Destination "publish\appsettings.Production.json" -Force
```

### 4. Start the Application

In AMP panel:

- Click **Start** button
- Verify in **Console** that app is listening on ports 5000 and 5001

### 5. Verify Deployment

- Check `https://zlg.gg` loads the frontend
- Check `https://zlg.gg/swagger` shows API documentation (dev mode only)

## Troubleshooting

**App won't start:**

- Check AMP Console for errors
- Verify all required files are in `publish/` folder
- Ensure `battlepass.yaml` and `appsettings.json` are present

**404 errors on website:**

- Verify `wwwroot/` folder exists in `publish/`
- Check `wwwroot/index.html` is present
- Restart the AMP instance

**502 Bad Gateway:**

- App may not be running or crashed
- Check AMP Console for errors
- Verify nginx is proxying to correct port (5000 or 5001)

## Notes

- The `.csproj` builds the React client automatically during publish
- Currently `wwwroot` must be manually copied (will be fixed in future update)
- AMP runs from `publish/` directory, not the repo root
