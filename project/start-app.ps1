Write-Host "Starting Loan Management Application..." -ForegroundColor Green
Write-Host ""

# Check if backend is already running
$backendRunning = $false
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3002/health" -Method GET -TimeoutSec 3
    if ($response.status -eq "OK") {
        Write-Host "✅ Backend is already running on port 3002" -ForegroundColor Green
        $backendRunning = $true
    }
} catch {
    Write-Host "❌ Backend not running, starting..." -ForegroundColor Yellow
}

# Start backend if not running
if (-not $backendRunning) {
    Write-Host "Starting Backend Server..." -ForegroundColor Blue
    Start-Process powershell -ArgumentList "-Command", "cd '$PWD'; node backend/server-pg.js" -WindowStyle Normal
    
    Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    # Verify backend started
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3002/health" -Method GET -TimeoutSec 5
        if ($response.status -eq "OK") {
            Write-Host "✅ Backend started successfully!" -ForegroundColor Green
        }
    } catch {
        Write-Host "❌ Backend failed to start" -ForegroundColor Red
        exit 1
    }
}

# Check if frontend is already running
$frontendRunning = $false
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000" -Method GET -TimeoutSec 3
    Write-Host "✅ Frontend is already running on port 3000" -ForegroundColor Green
    $frontendRunning = $true
} catch {
    Write-Host "❌ Frontend not running, starting..." -ForegroundColor Yellow
}

# Start frontend if not running
if (-not $frontendRunning) {
    Write-Host "Starting Frontend Server..." -ForegroundColor Blue
    Start-Process powershell -ArgumentList "-Command", "cd '$PWD'; npm run dev" -WindowStyle Normal
    
    Write-Host "Waiting for frontend to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
}

Write-Host ""
Write-Host "🚀 Application Status:" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:3002" -ForegroundColor White
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Opening browser..." -ForegroundColor Green
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
