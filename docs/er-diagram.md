# Database diagram

Six tables. Customers and cleaners are both stored in `users` and are separated by the `role`
column, because both roles use the same login.

```mermaid
erDiagram
    users ||--o{ services : offers
    users ||--o{ availability : has
    users ||--o{ bookings : books
    users ||--o{ messages : writes
    services ||--o{ bookings : "is booked as"
    bookings ||--o{ messages : contains
    bookings ||--o| reviews : gets

    users {
        serial id PK
        varchar name
        varchar email UK
        varchar password_hash
        varchar role "customer or provider"
        varchar avatar_url
        text bio
        decimal hourly_rate
        timestamp created_at
    }

    services {
        serial id PK
        integer provider_id FK
        varchar category "standard, deep, window, moveout"
        varchar title
        text description
        decimal price_from
    }

    availability {
        serial id PK
        integer provider_id FK
        integer weekday "0 = Sunday"
        time start_time
        time end_time
    }

    bookings {
        serial id PK
        integer customer_id FK
        integer provider_id FK
        integer service_id FK
        date booking_date
        time start_time
        time end_time
        varchar status "pending, confirmed, declined, cancelled, completed"
        decimal estimated_price
        timestamp created_at
    }

    messages {
        serial id PK
        integer booking_id FK
        integer sender_id FK
        text body
        timestamp created_at
        timestamp read_at
    }

    reviews {
        serial id PK
        integer booking_id FK_UK
        integer rating "1 to 5"
        text comment
        timestamp created_at
    }
```

Notes:

- `bookings` points to `users` twice, once as the customer and once as the cleaner.
- `reviews.booking_id` is unique, so a booking can only be reviewed once (FR-13).
- `availability` stores the weekly working hours of a cleaner, and the API uses it to build the
  free time slots for a chosen day (FR-05).
- Deleting a user also deletes their services and working hours, and deleting a booking also
  deletes its messages and review.

The SQL that creates these tables is in `backend/db/schema.sql`.
