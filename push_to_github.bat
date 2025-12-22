@echo off
cd /d C:\Users\Robel\Documents\Hobby

echo Configuring git...
git config user.email "robtilaye@gmail.com"
git config user.name "Robel"

echo.
echo Checking git status...
git status

echo.
echo Adding all changes...
git add -A

echo.
echo Committing changes...
git commit -m "Fix: Resolve duplicate variables and missing startGame functions across all games"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo Done!
pause

