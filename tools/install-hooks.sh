#!/bin/sh
# Installs the pre-push audit gate. Run once after cloning:
#     sh tools/install-hooks.sh
REPO="$(git rev-parse --show-toplevel)"
cp "$REPO/tools/pre-push" "$REPO/.git/hooks/pre-push"
chmod +x "$REPO/.git/hooks/pre-push"
echo "pre-push audit gate installed in $REPO/.git/hooks/"
