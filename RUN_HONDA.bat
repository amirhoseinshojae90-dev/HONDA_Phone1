@echo off
setlocal
cd /d "%~dp0mobile\phone1"
echo ========================================
echo HONDA Phone 1 - clean setup and start
echo ========================================
echo.
call npm install
if errorlevel 1 (
  echo.
  echo npm install failed. Keep this window open and send the error text.
  pause
  exit /b 1
)
echo.
echo Starting Expo...
call npx expo start -c
pause
