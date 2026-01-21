.PHONY: help build up down restart logs logs-backend logs-web shell-backend shell-web install-backend install-web migrate fresh clean setup

help: ## Show this help message
	@echo "==================================="
	@echo "Docker Management Commands"
	@echo "==================================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Build all Docker containers
	docker compose build

up: ## Start all containers in background
	docker compose up -d

down: ## Stop all containers
	docker compose down

restart: ## Restart all containers
	docker compose restart

logs: ## Show logs from all containers
	docker compose logs -f

logs-backend: ## Show logs from Laravel backend
	docker compose logs -f backend

logs-web: ## Show logs from Next.js web
	docker compose logs -f web

logs-nginx: ## Show logs from Nginx
	docker compose logs -f nginx

shell-backend: ## Access Laravel backend container shell
	docker compose exec backend bash

shell-web: ## Access Next.js web container shell
	docker compose exec web sh

shell-mysql: ## Access MySQL container shell
	docker compose exec mysql mysql -u root -p

install-backend: ## Install Laravel dependencies
	docker compose exec backend composer install
	@echo "Waiting for database to be ready..."
	@sleep 5
	docker compose exec backend php artisan key:generate
	docker compose exec backend php artisan storage:link

install-web: ## Install Next.js dependencies (already done in build)
	docker compose exec web npm install

migrate: ## Run Laravel migrations
	docker compose exec backend php artisan migrate

seed: ## Run Laravel database seeders
	docker compose exec backend php artisan db:seed

fresh: ## Fresh Laravel installation with migrations and seeds
	docker compose exec backend php artisan migrate:fresh --seed

cache-clear: ## Clear all Laravel caches
	docker compose exec backend php artisan cache:clear
	docker compose exec backend php artisan config:clear
	docker compose exec backend php artisan route:clear
	docker compose exec backend php artisan view:clear

optimize: ## Optimize Laravel application
	docker compose exec backend php artisan optimize

test-backend: ## Run Laravel tests
	docker compose exec backend php artisan test

clean: ## Remove all containers, volumes and images
	docker compose down -v
	docker system prune -af --volumes

setup: ## Complete setup - build, start, and configure everything
	@echo "🚀 Starting Docker setup..."
	@echo ""
	@echo "Step 1: Building containers..."
	docker compose build
	@echo ""
	@echo "Step 2: Starting containers..."
	docker compose up -d
	@echo ""
	@echo "Step 3: Waiting for services to be ready..."
	@sleep 10
	@echo ""
	@echo "Step 4: Installing Laravel dependencies..."
	docker compose exec backend composer install
	@echo ""
	@echo "Step 5: Generating application key..."
	docker compose exec backend php artisan key:generate
	@echo ""
	@echo "Step 6: Creating storage link..."
	docker compose exec backend php artisan storage:link
	@echo ""
	@echo "Step 7: Running migrations..."
	docker compose exec backend php artisan migrate
	@echo ""
	@echo "✅ Setup complete!"
	@echo ""
	@echo "Your applications are running at:"
	@echo "  - Next.js Web:  http://localhost:3000"
	@echo "  - Laravel API:  http://localhost:8000"
	@echo "  - PhpMyAdmin:   http://localhost:8080"
	@echo ""
	@echo "Database credentials:"
	@echo "  - Host:     localhost:3306"
	@echo "  - Database: laravel_db"
	@echo "  - User:     laravel_user"
	@echo "  - Password: laravel_password"
	@echo ""

status: ## Show status of all containers
	docker compose ps