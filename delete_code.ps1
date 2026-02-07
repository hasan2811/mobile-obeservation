$path = "c:\Users\Rully\Desktop\Instagram Observ\mobile-obeservation\src\App.js"
$lines = Get-Content -Path $path

# Validation checks to ensure line numbers are correct
if ($lines[1375].Trim() -ne "{/* MODAL FORM */}") {
    Write-Error "Line 1376 validation failed. Content is: $($lines[1375])"
    exit 1
}
if ($lines[1500].Trim() -ne ")}") {
    Write-Error "Line 1501 validation failed. Content is: $($lines[1500])"
    exit 1
}

# Slice array to exclude the duplicate block
# Keep 0 to 1374 (Line 1 to 1375)
# Keep 1501 to End (Line 1502 to End)
$newLines = $lines[0..1374] + $lines[1501..($lines.Count-1)]

$newLines | Set-Content -Path $path -Encoding UTF8
Write-Host "Success"
