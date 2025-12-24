@echo off
echo Starting Fidel Games Server...
cd /d "%~dp0"
npm start
REM Open the game selection page (Home) after server starts
timeout /t 2 /nobreak >nul
start "" http://localhost:3000/
