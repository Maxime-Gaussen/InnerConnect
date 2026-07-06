CREATE DATABASE BigProject
    DEFAULT CHARACTER SET = 'utf8mb4';
-- Table User
use BigProject;
CREATE TABLE User (
    id_user INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    age INT,
    email VARCHAR(150),
    password VARCHAR(255)
);

-- Table Pro (spécialisation de User)
CREATE TABLE Pro (
    id_pro INT PRIMARY KEY AUTO_INCREMENT,
    id_user INT ,
    nom_cabinet VARCHAR(150),
    adresse VARCHAR(150),
    ville VARCHAR(150),
    description TEXT,
    horaire_cabinet VARCHAR(100),
    FOREIGN KEY (id_user) REFERENCES User(id_user)
);



-- Table Methodologie
CREATE TABLE Methodologie (
    id_methodologie INT PRIMARY KEY AUTO_INCREMENT,
    titre VARCHAR(150),
    descriptif TEXT,
    img_presentation VARCHAR(255)
);


-- Relation Exercer (Pro - Methodologie)
CREATE TABLE Exercer (
    id_pro INT,
    id_methodologie INT,
    PRIMARY KEY (id_pro, id_methodologie),
    FOREIGN KEY (id_pro) REFERENCES Pro(id_pro),
    FOREIGN KEY (id_methodologie) REFERENCES Methodologie(id_methodologie)
);