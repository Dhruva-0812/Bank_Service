CREATE DATABASE bankdb;
USE bankdb;

CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    fname VARCHAR(50),
    lname VARCHAR(50),
    phone VARCHAR(15),
    address VARCHAR(100),
    email VARCHAR(100),
    username VARCHAR(50) UNIQUE,
    password VARCHAR(100),
    balance INT DEFAULT 0
);

CREATE TABLE transactions(
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    type VARCHAR(20),
    amount INT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
