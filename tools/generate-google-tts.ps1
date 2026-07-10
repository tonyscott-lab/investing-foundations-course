param(
  [string]$NarrationId = "shares-intro"
)

$ErrorActionPreference = "Stop"
$secureKey = Read-Host "Paste the Google Gemini API key (it will stay hidden and will not be saved)" -AsSecureString
$keyPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)

try {
  $plainKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($keyPointer)
  $env:GEMINI_API_KEY = $plainKey
  $scriptPath = Join-Path $PSScriptRoot "generate-google-tts.mjs"
  & node $scriptPath --id $NarrationId
  if ($LASTEXITCODE -ne 0) {
    throw "Audio generation failed with exit code $LASTEXITCODE."
  }
}
finally {
  Remove-Item Env:GEMINI_API_KEY -ErrorAction SilentlyContinue
  $plainKey = $null
  if ($keyPointer -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($keyPointer)
  }
}
