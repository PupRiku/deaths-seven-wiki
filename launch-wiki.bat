@echo off
cd /d "%~dp0"
start "" cmd /c "npm run dev"
timeout /t 4 /nobreak >nul
start http://localhost:3000