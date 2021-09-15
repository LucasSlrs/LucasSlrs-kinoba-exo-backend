CREATE DATABASE kinobaexowhatsapp;

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    phone_number VARCHAR(25),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    password VARCHAR(50)
);