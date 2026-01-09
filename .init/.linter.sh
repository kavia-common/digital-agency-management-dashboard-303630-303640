#!/bin/bash
cd /home/kavia/workspace/code-generation/digital-agency-management-dashboard-303630-303640/project_management_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

