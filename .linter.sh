#!/bin/bash
cd /home/kavia/workspace/code-generation/fullstacktictactoe-97350-7dbc43d8/tic_tac_toe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

