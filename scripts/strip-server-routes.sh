#!/usr/bin/env bash
# Remove server-only routes for static export (GitHub Pages)
set -e

echo "🧹 Removing server-only routes for static export..."

rm -rf src/app/api
rm -rf src/app/docs/new
rm -rf src/app/docs/\[slug\]/edit

echo "✅ Server routes removed"
