#!/usr/bin/env bash
set -euo pipefail
BASE="${BASE:-http://localhost:3000}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-huaerjie001}"
COOKIE_JAR=$(mktemp)
trap 'rm -f "$COOKIE_JAR"' EXIT

curl -sf "$BASE/health" | grep -q ok

curl -sf -c "$COOKIE_JAR" -b "$COOKIE_JAR" -X POST "$BASE/api/v1/auth/login" \
  -H 'Content-Type: application/json' \
  -d "{\"password\":\"$ADMIN_PASSWORD\"}" | grep -q ok

DECK_NAME="smoke-$(date +%s)"
DECK=$(curl -sf -b "$COOKIE_JAR" -X POST "$BASE/api/v1/decks" \
  -H 'Content-Type: application/json' \
  -d "{\"name\":\"$DECK_NAME\"}")
DECK_ID=$(echo "$DECK" | node -e "process.stdout.write(String(JSON.parse(require('fs').readFileSync(0)).id))")

curl -sf -b "$COOKIE_JAR" -X POST "$BASE/api/v1/decks/$DECK_ID/cards" \
  -H 'Content-Type: application/json' \
  -d '{"question":"1+1?","referenceAnswer":"2"}' | grep -q '"id"'

KEY_JSON=$(curl -sf -b "$COOKIE_JAR" -X POST "$BASE/api/v1/api-keys" \
  -H 'Content-Type: application/json' \
  -d '{"name":"smoke","scopes":["cards:read","export"]}')
KEY=$(echo "$KEY_JSON" | node -e "process.stdout.write(JSON.parse(require('fs').readFileSync(0)).key)")

curl -sf -H "Authorization: Bearer $KEY" -X POST "$BASE/mcp/invoke" \
  -H 'Content-Type: application/json' \
  -d '{"tool":"export_backup"}' | grep -q schemaVersion

echo "smoke ok"
