#!/bin/bash

# =============================================================================
# Tasks CRUD API - Docker Startup Script
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="tasks-crud-api"
CONTAINER_NAME="tasks-crud-api"
PORT="${PORT:-3000}"
STORAGE_TYPE="${STORAGE_TYPE:-sqlite}"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! docker info &> /dev/null; then
        log_error "Docker daemon is not running. Please start Docker."
        exit 1
    fi

    log_success "Docker is available and running"
}

stop_existing_container() {
    if docker ps -q -f name="$CONTAINER_NAME" | grep -q .; then
        log_warning "Stopping existing container..."
        docker stop "$CONTAINER_NAME" > /dev/null
    fi

    if docker ps -aq -f name="$CONTAINER_NAME" | grep -q .; then
        log_warning "Removing existing container..."
        docker rm "$CONTAINER_NAME" > /dev/null
    fi
}

build_image() {
    log_info "Building Docker image: $IMAGE_NAME..."
    docker build -t "$IMAGE_NAME:latest" .
    log_success "Image built successfully"
}

run_container() {
    log_info "Starting container on port $PORT..."
    
    docker run -d \
        --name "$CONTAINER_NAME" \
        -p "$PORT:3000" \
        -e NODE_ENV=production \
        -e PORT=3000 \
        -e STORAGE_TYPE="$STORAGE_TYPE" \
        -v tasks-crud-data:/app/data \
        --restart unless-stopped \
        "$IMAGE_NAME:latest"

    log_success "Container started successfully"
}

wait_for_health() {
    log_info "Waiting for API to be ready..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "http://localhost:$PORT/tasks" > /dev/null 2>&1; then
            log_success "API is ready!"
            return 0
        fi
        
        echo -n "."
        sleep 1
        ((attempt++))
    done
    
    echo ""
    log_warning "API health check timed out, but container may still be starting..."
}

show_info() {
    echo ""
    echo -e "${GREEN}=================================================${NC}"
    echo -e "${GREEN}   Tasks CRUD API is running!${NC}"
    echo -e "${GREEN}=================================================${NC}"
    echo ""
    echo -e "  🌐 URL: ${BLUE}http://localhost:$PORT${NC}"
    echo -e "  📦 Storage: ${YELLOW}$STORAGE_TYPE${NC}"
    echo ""
    echo -e "  ${BLUE}Endpoints:${NC}"
    echo "    GET    /tasks              - List all tasks"
    echo "    GET    /tasks/:id          - Get task by ID"
    echo "    POST   /tasks              - Create a task"
    echo "    PUT    /tasks/:id          - Update a task"
    echo "    DELETE /tasks/:id          - Delete a task"
    echo "    PATCH  /tasks/:id/complete - Mark as complete"
    echo "    POST   /tasks/import       - Import from CSV"
    echo ""
    echo -e "  ${BLUE}Commands:${NC}"
    echo "    docker logs -f $CONTAINER_NAME  - View logs"
    echo "    docker stop $CONTAINER_NAME     - Stop container"
    echo "    docker start $CONTAINER_NAME    - Start container"
    echo ""
}

# Main execution
main() {
    echo ""
    echo -e "${BLUE}🚀 Tasks CRUD API - Docker Startup${NC}"
    echo ""

    check_docker
    stop_existing_container
    build_image
    run_container
    wait_for_health
    show_info
}

# Run main function
main "$@"
