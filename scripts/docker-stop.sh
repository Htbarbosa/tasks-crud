#!/bin/bash

# =============================================================================
# Tasks CRUD API - Docker Stop Script
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

CONTAINER_NAME="tasks-crud-api"

echo -e "${BLUE}🛑 Stopping Tasks CRUD API...${NC}"

if docker ps -q -f name="$CONTAINER_NAME" | grep -q .; then
    docker stop "$CONTAINER_NAME"
    echo -e "${GREEN}[SUCCESS]${NC} Container stopped"
else
    echo -e "${RED}[INFO]${NC} Container is not running"
fi

echo ""
echo "To remove the container completely, run:"
echo "  docker rm $CONTAINER_NAME"
echo ""
echo "To remove the data volume, run:"
echo "  docker volume rm tasks-crud-data"
