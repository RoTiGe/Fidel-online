# Complete Git Rebase and Push
Set-Location "c:\Users\Robel\Documents\Hobby\Fidel_Games_Online"

# Abort current rebase
git rebase --abort

# Now push with force (since we already have our commit)
git push origin main --force-with-lease

Write-Host "Done! Check output above for results."
