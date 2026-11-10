-- Database tables for the household service booking app
-- Run with: psql -d household_booking -f schema.sql

drop table if exists reviews;
drop table if exists messages;
drop table if exists bookings;
drop table if exists availability;
drop table if exists services;
drop table if exists users;

-- both customers and cleaners are in this table, the role column says which one
create table users (
  id serial primary key,
  name varchar(100) not null,
  email varchar(100) not null unique,
  password_hash varchar(200) not null,
  role varchar(20) not null check (role in ('customer', 'provider')),
  avatar_url varchar(300),
  bio text,
  hourly_rate decimal(6,2),
  created_at timestamp default now()
);

create table services (
  id serial primary key,
  provider_id integer not null references users(id) on delete cascade,
  category varchar(50) not null,
  title varchar(100) not null,
  description text,
  price_from decimal(6,2) not null
);

-- the days and hours when a cleaner can work
create table availability (
  id serial primary key,
  provider_id integer not null references users(id) on delete cascade,
  weekday integer not null,
  start_time time not null,
  end_time time not null
);

create table bookings (
  id serial primary key,
  customer_id integer not null references users(id),
  provider_id integer not null references users(id),
  service_id integer not null references services(id),
  booking_date date not null,
  start_time time not null,
  end_time time not null,
  status varchar(20) not null default 'pending'
    check (status in ('pending', 'confirmed', 'declined', 'cancelled', 'completed')),
  estimated_price decimal(8,2) not null,
  created_at timestamp default now()
);

create table messages (
  id serial primary key,
  booking_id integer not null references bookings(id) on delete cascade,
  sender_id integer not null references users(id),
  body text not null,
  created_at timestamp default now(),
  read_at timestamp
);

-- one review per booking only, that is why booking_id is unique
create table reviews (
  id serial primary key,
  booking_id integer not null unique references bookings(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamp default now()
);
