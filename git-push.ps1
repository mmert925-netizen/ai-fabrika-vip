# GitHub Desktop Git'ini PATH'e ekle ve push et
$env:Path = "C:\Users\WARP\AppData\Local\GitHubDesktop\app-3.5.4\resources\app\git\mingw64\bin;$env:Path"

Set-Location $PSScriptRoot

git add .
git commit -m "Guncelleme"
git push
