DROP DATABASE IF EXISTS `cadastrodb`;
CREATE DATABASE `cadastrodb`;
USE `cadastrodb`;

CREATE TABLE user (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    username VARCHAR(255),
    photo VARCHAR(255),
    birthDate DATE,
    password VARCHAR(255),
    passwordResetToken VARCHAR(255),
    passwordResetExpires DATETIME,
    email VARCHAR(255) UNIQUE NOT NULL,
    sex ENUM('Masculino', 'Feminino', 'Outro', 'Prefiro não responder'),
    status ENUM('Ativado', 'Desativado', 'Bloqueado') NOT NULL DEFAULT 'Ativado' ,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME
) ENGINE=InnoDB;

