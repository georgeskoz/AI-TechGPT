#!/bin/bash
# Start Customer Portal on port 5002
echo "Starting Customer Portal on http://localhost:5002"
vite --config apps/customer/vite.config.ts
