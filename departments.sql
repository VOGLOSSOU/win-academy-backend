-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 12 mars 2026 à 08:24
-- Version du serveur : 11.8.3-MariaDB-log
-- Version de PHP : 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `u135579832_wurami_Db`
--

-- --------------------------------------------------------

--
-- Structure de la table `departments`
--

CREATE TABLE `departments` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `code` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `departments`
--

INSERT INTO `departments` (`id`, `name`, `code`, `createdAt`, `updatedAt`) VALUES
('db390482-1dec-11f1-9f08-bc111e65a1f8', 'Alibori', 'AL', '2026-03-12 08:24:15.000', '2026-03-12 08:24:15.000'),
('db39092f-1dec-11f1-9f08-bc111e65a1f8', 'Atacora', 'AT', '2026-03-12 08:24:15.000', '2026-03-12 08:24:15.000'),
('db3909bf-1dec-11f1-9f08-bc111e65a1f8', 'Atlantique', 'AQ', '2026-03-12 08:24:15.000', '2026-03-12 08:24:15.000'),
('db3909e1-1dec-11f1-9f08-bc111e65a1f8', 'Borgou', 'BO', '2026-03-12 08:24:15.000', '2026-03-12 08:24:15.000'),
('db390a01-1dec-11f1-9f08-bc111e65a1f8', 'Collines', 'CO', '2026-03-12 08:24:15.000', '2026-03-12 08:24:15.000'),
('db390a26-1dec-11f1-9f08-bc111e65a1f8', 'Couffo', 'CU', '2026-03-12 08:24:15.000', '2026-03-12 08:24:15.000'),
('db390a4e-1dec-11f1-9f08-bc111e65a1f8', 'Donga', 'DO', '2026-03-12 08:24:15.000', '2026-03-12 08:24:15.000'),
('db390a6a-1dec-11f1-9f08-bc111e65a1f8', 'Littoral', 'LI', '2026-03-12 08:24:15.000', '2026-03-12 08:24:15.000'),
('db390a88-1dec-11f1-9f08-bc111e65a1f8', 'Mono', 'MO', '2026-03-12 08:24:15.000', '2026-03-12 08:24:15.000'),
('db390aa3-1dec-11f1-9f08-bc111e65a1f8', 'Ouémé', 'OU', '2026-03-12 08:24:15.000', '2026-03-12 08:24:15.000'),
('db390abc-1dec-11f1-9f08-bc111e65a1f8', 'Plateau', 'PL', '2026-03-12 08:24:15.000', '2026-03-12 08:24:15.000'),
('db390ad5-1dec-11f1-9f08-bc111e65a1f8', 'Zou', 'ZO', '2026-03-12 08:24:15.000', '2026-03-12 08:24:15.000');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `departments_name_key` (`name`),
  ADD UNIQUE KEY `departments_code_key` (`code`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
