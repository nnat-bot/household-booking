# API endpoints

REST API used by the mobile app. Base URL in development is `http://localhost:4000`.

Endpoints marked with a token need the header `Authorization: Bearer <token>`. The token is
returned by register and login and is valid for 7 days.

## Authentication

| Method | Path | Token | Description | Requirement |
| --- | --- | --- | --- | --- |
| POST | `/auth/register` | no | Creates a customer or provider account and returns a token | FR-01 |
| POST | `/auth/login` | no | Checks email and password and returns a token | FR-02 |
| GET | `/auth/me` | yes | Returns the logged in user, used when the app starts | FR-02 |

## Services

| Method | Path | Token | Description | Requirement |
| --- | --- | --- | --- | --- |
| GET | `/services` | no | Lists cleaning services, optional `category` and `maxPrice` query parameters | FR-03, FR-14 |
| GET | `/services/categories` | no | Lists the service categories with the cheapest price, used in the filter screen | FR-14 |

## Cleaners

| Method | Path | Token | Description | Requirement |
| --- | --- | --- | --- | --- |
| GET | `/providers` | no | Lists cleaners with their average rating and review count | FR-03 |
| GET | `/providers/:id` | no | One cleaner with services, reviews and average rating | FR-04 |
| GET | `/providers/:id/slots?date=YYYY-MM-DD` | no | Free two hour slots on one day, booked times are left out | FR-05 |
| PUT | `/providers/me` | yes | The cleaner updates name, bio, hourly rate and photo | FR-10 |
| GET | `/providers/me/availability` | yes | The working hours of the logged in cleaner | FR-11 |
| PUT | `/providers/me/availability` | yes | Replaces the weekly working hours | FR-11 |
| GET | `/providers/me/services` | yes | The services of the logged in cleaner | FR-10 |
| POST | `/providers/me/services` | yes | The cleaner adds a new service | FR-10 |
| PUT | `/providers/me/services/:id` | yes | The cleaner edits a service | FR-10 |
| DELETE | `/providers/me/services/:id` | yes | The cleaner removes a service that has no bookings | FR-10 |

## Bookings

| Method | Path | Token | Description | Requirement |
| --- | --- | --- | --- | --- |
| POST | `/bookings` | yes | The customer books a cleaner, the booking starts as pending | FR-06 |
| GET | `/bookings` | yes | The customer gets the own bookings, the cleaner gets the requests | FR-07, FR-12 |
| GET | `/bookings/:id` | yes | One booking, only for the customer or the cleaner of that booking | FR-07 |
| PUT | `/bookings/:id/cancel` | yes | The customer cancels a pending or confirmed booking | FR-08 |
| PUT | `/bookings/:id/accept` | yes | The cleaner confirms a pending request | FR-12 |
| PUT | `/bookings/:id/decline` | yes | The cleaner declines a pending request | FR-12 |
| PUT | `/bookings/:id/complete` | yes | The cleaner marks a confirmed booking as completed | FR-15 |

## Messages

| Method | Path | Token | Description | Requirement |
| --- | --- | --- | --- | --- |
| GET | `/messages/:bookingId` | yes | All messages of one booking, the app calls this every 5 seconds | FR-09 |
| POST | `/messages/:bookingId` | yes | Sends a text message in the booking chat | FR-09 |

## Reviews

| Method | Path | Token | Description | Requirement |
| --- | --- | --- | --- | --- |
| POST | `/reviews` | yes | The customer rates a completed booking from 1 to 5 with a comment | FR-13 |

## Booking status

A booking can have five statuses and the API only allows these changes:

```
pending   -> confirmed | declined | cancelled
confirmed -> completed | cancelled
```

## Errors

Every error answer has the same shape so the app can show the message directly:

```json
{ "error": "This time is already booked" }
```

| Code | When |
| --- | --- |
| 400 | Missing fields, wrong values, or an action that the booking status does not allow |
| 401 | No token or the token is not valid anymore |
| 403 | The user is not the customer or the cleaner of that booking |
| 404 | The booking, cleaner or service does not exist |
| 500 | Database or server problem |

## Security

Passwords are hashed with bcrypt before they are saved. Every endpoint that returns personal
data checks the token first, and bookings and messages are only returned to the customer or the
cleaner of that booking (NFR-06).
