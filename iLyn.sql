CREATE DATABASE  IF NOT EXISTS `iLyn` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `iLyn`;
-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: iLyn
-- ------------------------------------------------------
-- Server version	8.0.33-0ubuntu0.22.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `duedate` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `completed` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (11,1,'Reminder','Poker','2023-06-04','2023-06-03 12:33:40',1),(12,1,'Reminder','My homework','2023-06-05','2023-06-03 12:51:44',1),(13,1,'Hola','prueba','2002-08-08','2023-06-03 12:54:44',1),(14,1,'Submit Monthly Report','Compile and submit the monthly report to the manager','2023-05-15','2023-06-03 13:20:52',1),(15,1,'Attend Team Meeting','Participate in the team meeting to discuss project progress','2023-05-18','2023-06-03 13:20:52',1),(16,1,'Complete Training Module','Finish the online training module on new software tools','2023-05-20','2023-06-03 13:20:52',1),(17,1,'Review Marketing Campaign','Evaluate the effectiveness of the recent marketing campaign','2023-05-25','2023-06-03 13:20:52',1),(18,1,'Prepare Budget Proposal','Develop a budget proposal for the upcoming fiscal year','2023-05-30','2023-06-03 13:20:52',1),(19,1,'Conduct Customer Survey','Collect feedback from customers through a survey','2023-06-02','2023-06-03 13:20:52',1),(20,1,'Test Software Update','Perform testing on the latest software update for bug identification','2023-06-05','2023-06-03 13:20:52',1),(21,1,'Create Social Media Content','Generate engaging content for social media platforms','2023-06-10','2023-06-03 13:20:52',1),(22,1,'Organize Team Building Event','Plan and coordinate a team-building event for the department','2023-06-15','2023-06-03 13:20:52',1),(23,1,'Finalize Sales Presentation','Polish and finalize the sales presentation for potential clients','2023-06-20','2023-06-03 13:20:52',1),(24,1,'Reminder','Golf','2023-06-07','2023-06-03 16:59:16',1),(35,1,'Reminder','Poker','2023-06-05','2023-06-04 11:42:13',1);
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'John Doe','john@example.com','johndoe','password123'),(2,'Jane Smith','jane@example.com','janesmith','password456'),(3,'Mike Johnson','mike@example.com','mikejohnson','password789');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-04 15:02:35
