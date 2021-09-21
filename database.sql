CREATE DATABASE kinobaexowhatsapp;

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    phone_number VARCHAR(25),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    password VARCHAR(500)
);

CREATE TABLE messages(
    message_id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    message VARCHAR(5000),
    message_from INT REFERENCES users(user_id),
    message_to INT REFERENCES users(user_id),
    message_date DATE NOT NULL
);

-- message2 not working. Ask for Advice for date
CREATE TABLE messages2(
    message_id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    message VARCHAR(5000),
    message_from INT REFERENCES users(user_id),
    message_to INT REFERENCES users(user_id),
    message_date DATE DEFAULT CURRENT_TIMESTAMP
);

