#!/bin/bash
# Start Admin Portal on port 5001
echo "Starting Admin Portal on http://localhost:5001"
vite --config apps/admin/vite.config.ts
