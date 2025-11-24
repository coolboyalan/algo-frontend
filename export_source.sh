
#!/usr/bin/env bash
set -euo pipefail

# export_source.sh
# Usage: run from project root: bash ./export_source.sh
# Produces: admin-source.zip and all-code.txt in the current dir (overwrites if exist)

ZIP_NAME="admin-source.zip"
TXT_NAME="all-code.txt"
EXCLUDE_PATTERNS=(
  "node_modules/*"
  ".next/*"
  "dist/*"
  "build/*"
  ".git/*"
  "*.log"
)

echo "Starting export at $(date). This may take a few seconds for large projects..."

# 1) Create zip (excluding heavy folders)
echo "Creating ZIP: ${ZIP_NAME} (excluding node_modules, .next, dist, build, .git, *.log)"
# build -x arguments
EXCLUDE_ARGS=()
for p in "${EXCLUDE_PATTERNS[@]}"; do
  EXCLUDE_ARGS+=(-x "$p")
done

# Use zip if available
if command -v zip >/dev/null 2>&1; then
  # Remove existing zip if any
  rm -f "$ZIP_NAME"
  # -r recursive, -q quiet
  zip -r "$ZIP_NAME" . "${EXCLUDE_ARGS[@]}" >/dev/null
  echo "ZIP created: $(pwd)/$ZIP_NAME"
else
  echo "zip not found, creating tar.gz instead..."
  TAR_NAME="${ZIP_NAME%.zip}.tar.gz"
  rm -f "$TAR_NAME"
  tar --exclude='node_modules' --exclude='.next' --exclude='dist' --exclude='build' --exclude='.git' --exclude='*.log' -czf "$TAR_NAME" .
  echo "tar.gz created: $(pwd)/$TAR_NAME"
fi

# 2) Create single concatenated text file with separators (useful if you want to paste)
echo "Creating concatenated text file: ${TXT_NAME} (this can be large)"
rm -f "$TXT_NAME"
# Find files, exclude patterns, then cat with headers
# Limit to typical source file types to keep size reasonable; remove -name filters if you want truly everything
find . \
  -type f \
  ! -path "./node_modules/*" \
  ! -path "./.next/*" \
  ! -path "./dist/*" \
  ! -path "./build/*" \
  ! -path "./.git/*" \
  \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.css" -o -name "*.html" -o -name "*.env" -o -name "next.config.*" \) \
  -print0 | sort -z | while IFS= read -r -d '' f; do
    echo "----- FILE: $f -----" >> "$TXT_NAME"
    # show binary-safe; fallback to hexdump for binary if needed
    if file "$f" | grep -q text; then
      sed -n '1,20000p' "$f" >> "$TXT_NAME" || true
    else
      echo "[binary file omitted]" >> "$TXT_NAME"
    fi
    echo -e "\n" >> "$TXT_NAME"
  done

echo "Concatenated text file created: $(pwd)/$TXT_NAME"

# 3) If on macOS, offer to copy small file to clipboard (safe only if under ~10MB)
if command -v pbcopy >/dev/null 2>&1; then
  SIZE=$(stat -f%z "$TXT_NAME" 2>/dev/null || stat -c%s "$TXT_NAME" 2>/dev/null || echo 0)
  if [ "$SIZE" -le $((10 * 1024 * 1024)) ]; then
    echo "Copying concatenated text to clipboard (size ${SIZE} bytes)..."
    cat "$TXT_NAME" | pbcopy
    echo "Content copied to clipboard."
  else
    echo "Concatenated text file is large (${SIZE} bytes). Not copying to clipboard automatically."
  fi
fi

echo "Export complete."
echo " - ZIP: $(pwd)/$ZIP_NAME"
echo " - Text dump: $(pwd)/$TXT_NAME"
echo
echo "Upload the ZIP (or the TXT) and I'll analyze the admin panel and produce the API Gateway contract."
