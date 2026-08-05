# Installation Guide

## Prerequisites
- Node.js LTS (20.x recommended)
- npm
- MySQL 8+ (or Dockerized MySQL)
- Git

Verify:
```bash
node -v
npm -v
mysql --version
```

## 1) Clone and install backend
```bash
git clone https://github.com/JohnMo117/FlorenceWeb.git
cd FlorenceWeb
npm install
```

## 2) Configure environment variables
Create `.env` in repository root with at least:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=Escuela_Ingles
JWT_SECRET=replace_with_secure_value
```

## 3) Start backend
```bash
npm run devStart
```
Backend listens on `http://127.0.0.1:3000`.

## 4) Install and run frontend (React)
```bash
cd client
npm install
npm run dev
```
Frontend dev server typically runs on `http://localhost:5173`.

## 5) Production build flow
```bash
cd client
npm run build
cd ..
NODE_ENV=production npm run devStart
```
In production mode, Express serves `client/dist`.

## Optional: MySQL via Docker
Example command:
```bash
docker run --name florence-mysql \
  -e MYSQL_ROOT_PASSWORD=your_password \
  -e MYSQL_DATABASE=Escuela_Ingles \
  -p 3306:3306 -d mysql:8
```
Then keep `.env` aligned with these values.
