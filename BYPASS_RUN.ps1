$workingDir = Get-Location
$nodeFolder = Join-Path $workingDir "node_portable"
$nodeZip = Join-Path $workingDir "node.zip"
$nodeUrl = "https://nodejs.org/dist/v20.11.1/node-v20.11.1-win-x64.zip"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   HSSE APP BYPASS RUNNER (NO ADMIN)     " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

if (-not (Test-Path (Join-Path $nodeFolder "node.exe"))) {
    Write-Host "[!] Node.js belum ada. Memulai unduhan otomatis..." -ForegroundColor Yellow
    
    try {
        Write-Host "--> Mendownload Node.js v20.11.1..."
        Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeZip
        
        Write-Host "--> Mengekstrak file (mohon tunggu)..."
        if (Test-Path "$nodeFolder`_temp") { Remove-Item "$nodeFolder`_temp" -Recurse -Force }
        Expand-Archive -Path $nodeZip -DestinationPath "$nodeFolder`_temp" -Force
        
        $extractedDir = Get-ChildItem -Path "$nodeFolder`_temp" -Directory | Select-Object -First 1
        
        if (-not (Test-Path $nodeFolder)) { New-Item -ItemType Directory -Path $nodeFolder }
        Copy-Item -Path "$($extractedDir.FullName)\*" -Destination $nodeFolder -Recurse -Force
        
        Remove-Item $nodeZip -Force
        Remove-Item "$nodeFolder`_temp" -Recurse -Force
        
        # Penyesuaian struktur jika diperlukan (npm harus di dalam node_modules)
        if (Test-Path (Join-Path $nodeFolder "npm")) {
            $internalNM = Join-Path $nodeFolder "node_modules"
            if (-not (Test-Path $internalNM)) { New-Item -ItemType Directory -Path $internalNM }
            Move-Item -Path (Join-Path $nodeFolder "npm") -Destination $internalNM -Force
            if (Test-Path (Join-Path $nodeFolder "corepack")) {
                Move-Item -Path (Join-Path $nodeFolder "corepack") -Destination $internalNM -Force
            }
        }
        
        Write-Host "[OK] Node.js Portable berhasil disiapkan!" -ForegroundColor Green
    }
    catch {
        Write-Host "[EROR] Gagal menyiapkan Node.js. Hubungi IT atau download manual ke folder 'node_portable'." -ForegroundColor Red
        Write-Error $_
        pause
        exit
    }
}

# Tambahkan Node ke PATH sesi ini saja
$env:PATH = "$nodeFolder;" + $env:PATH

# Cek apakah node_modules ada, jika tidak jalankan npm install
if (-not (Test-Path (Join-Path $workingDir "node_modules"))) {
    Write-Host "[...] node_modules tidak ditemukan. Menjalankan npm install..." -ForegroundColor Yellow
    npm install
}

Write-Host "--> Menjalankan Aplikasi..." -ForegroundColor Green
npm start
