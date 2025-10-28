#!/bin/bash
# Start Service Provider Portal on port 5003
echo "Starting Service Provider Portal on http://localhost:5003"
vite --config apps/provider/vite.config.ts
