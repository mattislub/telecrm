# TeleCRM

This project contains a React frontend and a small Node backend.

## Prerequisites

- Node.js 20+
- npm

## Installation

Install the dependencies for both the frontend and backend:

```bash
npm install
```

## Environment variables

Copy `.env.example` to `.env` and update the values if required:

```bash
cp .env.example .env
```

Variables used for database connectivity:

- `DB_HOST` - database host
- `DB_PORT` - database port
- `DB_USER` - username
- `DB_PASSWORD` - password
- `DB_NAME` - database name (e.g., `Miriam`)
- `PORT` - optional backend server port (defaults to `4000`)

## Running the frontend

Start the Vite development server:

```bash
npm run dev
```

## Starting the backend

The backend lives in `backend/server.cjs`. To run it with the environment
variables defined in `.env`:

```bash
npm run backend
```

Alternatively you can directly run:

```bash
node --env-file=.env backend/server.cjs
```

## Inspecting the database

phpMyAdmin can be used to inspect the `Miriam` database while developing.

