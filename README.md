# Household Service Booking App

This is my bachelor's thesis project for Haaga-Helia UAS. It is a mobile app where customers
can find and book independent cleaners in the Helsinki area.

Folders:

- `mobile/` - the React Native app (Expo + TypeScript)
- `backend/` - the REST API (Node.js, Express, PostgreSQL)
- `docs/` - database diagram, API list, test checklist and screenshots

## How to run the backend

First create the database and add the test data:

```
createdb household_booking
cd backend
npm install
npm run seed
```

Then copy `.env.example` to `.env`, put your own JWT secret there and start the server:

```
npm run dev
```

The API runs on http://localhost:4000

## Test accounts

All test accounts use the password `password123`.

- anna@example.com (customer)
- mikko@example.com (customer)
- sofia@example.com (cleaner)
- elena@example.com (cleaner)

All the data here is made up, it is only for testing.
