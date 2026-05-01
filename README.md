# 🌍 Eco-Travel App V2 (T7wisa)

Welcome to the Eco-Travel App (V2) repository, officially known as **T7wisa**. This platform is a comprehensive travel ecosystem designed to promote sustainable and eco-friendly tourism. It features a seamless cross-platform mobile app, a modern web interface, and a robust backend.

## 🏗️ System Architecture

This project follows a structured monorepo design, separated into three main environments:

- **📱 Mobile App (`app/t7wisa/`)**: A cross-platform mobile application built with **Flutter** (Dart).
- **🌐 Web App (`web/`)**: A fast, SEO-friendly frontend application built utilizing **Next.js**, **React**, and **Tailwind CSS**.
- **⚙️ Backend (`backend/`)**: A powerful API and admin dashboard crafted with **Laravel** (PHP). It acts as the central hub, handling core business logic, database management, and third-party integrations.

## ✨ Key Functionalities

1. **✈️ Advanced Flight & Travel Search**: Deep integration with the **Amadeus API**, enabling real-time flight searches, caching, algorithms, and automated bookings.
2. **💳 Secure E-Payments**: Integrated with **Chargily** to handle smooth, secure transactions natively.
3. **🔔 Real-Time Notifications**: Utilizes **Pusher** alongside Laravel's broadcasting features to deliver real-time updates for bookings, live alerts, and user chats.
4. **📊 Powerful Admin Dashboard**: Built utilizing **Laravel Filament**, offering comprehensive management over users, content, analytical data, and bookings.
5. **🌱 Eco-Friendly Travel Focus**: Highlights sustainable travel options, local tourism, and minimizes booking overhead.
6. **🚀 Scalable Infrastructure**: Completely dockerized environments (`Dockerfile`, `docker-compose.yml`) equipped with production-ready instructions for **Fly.io** deployment configuration.

## 🚀 Getting Started

### Prerequisites

Please ensure you have the following installed on your machine:
- [Docker & Docker Compose](https://www.docker.com/) 🐳
- [Flutter SDK](https://flutter.dev/) 📱
- [Node.js](https://nodejs.org/) (latest LTS) 🟩
- [PHP](https://www.php.net/) & [Composer](https://getcomposer.org/) 🐘

### 🛠️ Global Application Setup

The most effective way to spin up the required backing services (database, Redis, nginx) is via Docker:

```bash
# Start all requisite services in the background
docker-compose up -d
```

### ⚙️ Backend Setup (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Migrate the database and seed initial test data
php artisan migrate --seed
# Start the local development server
php artisan serve
```

### 🌐 Web App Setup (Next.js)

```bash
cd web
npm install
# Start the development server
npm run dev
```

### 📱 Mobile App Setup (Flutter)

```bash
cd app/t7wisa
flutter pub get
# Run the application on an active emulator or connected device
flutter run
```

## 🔌 Third-Party Integrations & Packages

This application takes advantage of the following major third-party technologies:
- **Amadeus API (`amadeus4dev`)**: World-class global travel software provider.
- **Chargily Pay**: Leading payment gateways and processing.
- **Pusher**: Event and persistent websocket tracking.
- **Filament**: Rapid administrative UI panel construction.

## 🐳 Deployment & CI/CD

The project ships with configurations for standardized containerized deployment (e.g., `Dockerfile`, `Dockerfile.prod`). We have also provided a `fly.toml` setup for deploying swiftly to **Fly.io**, alongside a robust `fly-nginx.conf` and `Makefile` for streamlined CI/CD pipeline automation and execution ease.
