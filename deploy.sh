#!/usr/bin/env bash
set -e

echo "==========================================="
echo "  Deploying ADGIPS Website to Vercel"
echo "==========================================="

# Check build health first
echo "Step 1: Validating production build..."
npm run build

echo "Step 2: Deploying to Vercel Production..."
npx vercel --prod "$@"

echo "==========================================="
echo "  Deployment Complete!"
echo "==========================================="
