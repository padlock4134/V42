# PowerShell script to fix the Kitchen.jsx file
$content = Get-Content -Path "c:\Users\paddy\OneDrive\Desktop\V4\src\pages\Kitchen.jsx" -Raw

# Fix the file by ensuring proper closing tags and brackets
$content = $content -replace "main className=`"container mx-auto px-4 py-8 pt-24`">", ""

# Write the fixed content back to the file
$content | Set-Content -Path "c:\Users\paddy\OneDrive\Desktop\V4\src\pages\Kitchen.jsx"

Write-Host "Kitchen.jsx file has been fixed."
