# Push changes to GitHub
cd "C:\Users\Robel\Documents\Hobby"

Write-Host "Checking git status..." -ForegroundColor Cyan
git status

Write-Host "`nAdding all changes..." -ForegroundColor Cyan
git add -A

Write-Host "`nCommitting changes..." -ForegroundColor Cyan
git commit -m "Fix: Resolve duplicate variables and missing startGame functions across all games

- Fixed duplicate gameStarted variable in Tutorial Mode and Derder games
- Fixed duplicate startGame function in Alphabet Learning and Derder games
- Added missing startGame function to Platformer game
- Wrapped DOM-dependent code in DOMContentLoaded event
- Added null checks for DOM element access
- All 5 games now fully functional"

Write-Host "`nPushing to GitHub..." -ForegroundColor Cyan
git push

Write-Host "`nDone!" -ForegroundColor Green

