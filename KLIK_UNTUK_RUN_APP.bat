@echo off
TITLE HSSE App Bypass Runner
echo Membuka PowerShell Bypass...
powershell -ExecutionPolicy Bypass -File "%~dp0BYPASS_RUN.ps1"
if %errorlevel% neq 0 (
    echo.
    echo Terjadi kesalahan. Pastikan koneksi internet aktif.
    pause
)
