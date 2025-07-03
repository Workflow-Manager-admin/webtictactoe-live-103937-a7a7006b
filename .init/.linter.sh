#!/bin/bash
cd /home/kavia/workspace/code-generation/webtictactoe-live-103937-a7a7006b/tic_tac_toe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

