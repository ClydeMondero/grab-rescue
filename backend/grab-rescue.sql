-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 14, 2024 at 01:42 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `grab-rescue`
--

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
  `log_id` int(11) NOT NULL,
  `date_time` datetime NOT NULL,
  `action` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `logs`
--

INSERT INTO `logs` (`log_id`, `date_time`, `action`, `user_id`) VALUES
(1, '2024-09-06 20:39:27', 'Login', 18),
(4, '2024-09-06 20:44:57', 'Logout', 18),
(5, '2024-09-06 21:02:46', 'Login', 18),
(6, '2024-09-06 21:44:15', 'Logout', 18),
(7, '2024-09-06 21:44:27', 'Login', 18);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_initial` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `birthday` date NOT NULL,
  `age` int(11) NOT NULL,
  `municipality` varchar(255) NOT NULL,
  `barangay` varchar(255) NOT NULL,
  `profile_image` varchar(255) NOT NULL,
  `contact_number` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `account_type` varchar(255) NOT NULL,
  `verified` tinyint(1) NOT NULL,
  `is_online` tinyint(1) NOT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expire` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `middle_initial`, `last_name`, `birthday`, `age`, `municipality`, `barangay`, `profile_image`, `contact_number`, `email`, `username`, `password`, `account_type`, `verified`, `is_online`, `reset_token`, `reset_token_expire`) VALUES
(18, 'Bhenz Mharl', 'L', 'Bartolome', '2003-01-26', 21, 'San Rafael', 'Tambubong', '', '', 'bhenz12603@gmail.com', 'bhenzmharl', '$2b$10$XmHKhgQHhnzjN/nae0R/fu6Ad/P7APVmRYnnwGKNqnxEPe0yK65jq', 'Admin', 1, 0, NULL, NULL),
(22, 'Markjames', 'S.', 'Villagonzalo', '2003-06-21', 21, 'Baliuag', 'Subic', '', '', 'mj@gmail.com', 'markjames', '$2b$10$m20JNOa3mY5NzpHLYx4w4OaejjPqSZnaNRVJG0aBrztO4NfREasAS', 'Rescuer', 0, 0, NULL, NULL),
(23, 'Rikki Jane', 'M', 'Vinas', '2003-04-08', 21, 'Baliuag', 'Poblacion', '', '09451824631', 'rikkijane@gmail.com', 'rikkijane', '$2b$10$6pu4KSGE2C6kBxtNjeHp1eoE1/0K4xq3bFFGMHXliV3prmBLrWgK2', 'Rescuer', 0, 0, NULL, NULL),
(26, 'Andrei John', 'V', 'Poma', '2003-12-11', 20, 'San Rafael', 'Capihan', '', '09451824631', 'andreipoma@gmail.com', 'andreipoma', '$2b$10$QEZu3VaPv/uiFay9txJvBOIQW0vUCimN7qa6ipW78TW.ZF7sCIKau', 'Rescuer', 0, 0, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id_constraint` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `logs`
--
ALTER TABLE `logs`
  ADD CONSTRAINT `user_id_constraint` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
