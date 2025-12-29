-- ==========================================
-- WHITE PHONE OS - COMPLETE DATABASE SCHEMA
-- ==========================================

-- Core Tables
-- ==========================================

CREATE TABLE IF NOT EXISTS `phone_devices` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `device_id` VARCHAR(50) UNIQUE NOT NULL,
  `phone_number` VARCHAR(20) UNIQUE NOT NULL,
  `phone_account_id` INT NOT NULL,
  `device_type` ENUM('phone', 'hackphone') DEFAULT 'phone',
  `battery` INT DEFAULT 100,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_device_id` (`device_id`),
  INDEX `idx_phone_number` (`phone_number`),
  INDEX `idx_account` (`phone_account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `phone_accounts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `owner_identifier` VARCHAR(100) NOT NULL,
  `pin` VARCHAR(4) DEFAULT NULL,
  `face_id_enabled` BOOLEAN DEFAULT FALSE,
  `cloud_backup_enabled` BOOLEAN DEFAULT TRUE,
  `last_backup` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_owner` (`owner_identifier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Communication Tables
-- ==========================================

CREATE TABLE IF NOT EXISTS `phone_contacts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `phone_account_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `phone_number` VARCHAR(20) NOT NULL,
  `avatar` VARCHAR(255) DEFAULT NULL,
  `favorite` BOOLEAN DEFAULT FALSE,
  `blocked` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`phone_account_id`) REFERENCES `phone_accounts`(`id`) ON DELETE CASCADE,
  INDEX `idx_account_contacts` (`phone_account_id`),
  INDEX `idx_phone_number` (`phone_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `phone_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `conversation_id` VARCHAR(100) NOT NULL,
  `sender_number` VARCHAR(20) NOT NULL,
  `receiver_number` VARCHAR(20) NOT NULL,
  `content` TEXT NOT NULL,
  `media_url` VARCHAR(255) DEFAULT NULL,
  `read` BOOLEAN DEFAULT FALSE,
  `delivered` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_conversation` (`conversation_id`),
  INDEX `idx_sender` (`sender_number`),
  INDEX `idx_receiver` (`receiver_number`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `phone_calls` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `caller_number` VARCHAR(20) NOT NULL,
  `receiver_number` VARCHAR(20) NOT NULL,
  `type` ENUM('incoming', 'outgoing', 'missed') NOT NULL,
  `duration` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_caller` (`caller_number`),
  INDEX `idx_receiver` (`receiver_number`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Social Media Tables
-- ==========================================

CREATE TABLE IF NOT EXISTS `phone_twitter_profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `phone_account_id` INT NOT NULL,
  `handle` VARCHAR(50) UNIQUE NOT NULL,
  `display_name` VARCHAR(100) NOT NULL,
  `bio` TEXT DEFAULT NULL,
  `avatar` VARCHAR(255) DEFAULT NULL,
  `verified` BOOLEAN DEFAULT FALSE,
  `followers_count` INT DEFAULT 0,
  `following_count` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`phone_account_id`) REFERENCES `phone_accounts`(`id`) ON DELETE CASCADE,
  INDEX `idx_handle` (`handle`),
  INDEX `idx_account` (`phone_account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `phone_twitter_tweets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `profile_id` INT NOT NULL,
  `content` VARCHAR(280) NOT NULL,
  `media_url` VARCHAR(255) DEFAULT NULL,
  `likes_count` INT DEFAULT 0,
  `retweets_count` INT DEFAULT 0,
  `replies_count` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`profile_id`) REFERENCES `phone_twitter_profiles`(`id`) ON DELETE CASCADE,
  INDEX `idx_profile` (`profile_id`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `phone_twitter_likes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tweet_id` INT NOT NULL,
  `profile_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`tweet_id`) REFERENCES `phone_twitter_tweets`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`profile_id`) REFERENCES `phone_twitter_profiles`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_like` (`tweet_id`, `profile_id`),
  INDEX `idx_tweet` (`tweet_id`),
  INDEX `idx_profile` (`profile_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Banking Tables
-- ==========================================

CREATE TABLE IF NOT EXISTS `phone_bank_accounts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `phone_account_id` INT NOT NULL,
  `account_number` VARCHAR(20) UNIQUE NOT NULL,
  `balance` DECIMAL(15,2) DEFAULT 0.00,
  `account_type` ENUM('checking', 'savings') DEFAULT 'checking',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`phone_account_id`) REFERENCES `phone_accounts`(`id`) ON DELETE CASCADE,
  INDEX `idx_account` (`phone_account_id`),
  INDEX `idx_account_number` (`account_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `phone_bank_transactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `account_id` INT NOT NULL,
  `type` ENUM('deposit', 'withdrawal', 'transfer') NOT NULL,
  `amount` DECIMAL(15,2) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `recipient_account` VARCHAR(20) DEFAULT NULL,
  `balance_after` DECIMAL(15,2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`account_id`) REFERENCES `phone_bank_accounts`(`id`) ON DELETE CASCADE,
  INDEX `idx_account` (`account_id`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Media Tables
-- ==========================================

CREATE TABLE IF NOT EXISTS `phone_gallery` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `phone_account_id` INT NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `thumbnail` VARCHAR(255) DEFAULT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`phone_account_id`) REFERENCES `phone_accounts`(`id`) ON DELETE CASCADE,
  INDEX `idx_account` (`phone_account_id`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Utility Tables
-- ==========================================

CREATE TABLE IF NOT EXISTS `phone_emails` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `phone_account_id` INT NOT NULL,
  `sender` VARCHAR(100) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `body` TEXT NOT NULL,
  `read` BOOLEAN DEFAULT FALSE,
  `starred` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`phone_account_id`) REFERENCES `phone_accounts`(`id`) ON DELETE CASCADE,
  INDEX `idx_account` (`phone_account_id`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `phone_calendar_events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `phone_account_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `start_time` DATETIME NOT NULL,
  `end_time` DATETIME NOT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `color` VARCHAR(7) DEFAULT '#007AFF',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`phone_account_id`) REFERENCES `phone_accounts`(`id`) ON DELETE CASCADE,
  INDEX `idx_account` (`phone_account_id`),
  INDEX `idx_start_time` (`start_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `phone_notes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `phone_account_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `color` VARCHAR(7) DEFAULT '#FFD60A',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`phone_account_id`) REFERENCES `phone_accounts`(`id`) ON DELETE CASCADE,
  INDEX `idx_account` (`phone_account_id`),
  INDEX `idx_updated` (`updated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Emergency Tables
-- ==========================================

CREATE TABLE IF NOT EXISTS `phone_emergency_calls` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `caller_number` VARCHAR(20) NOT NULL,
  `service_type` ENUM('police', 'ems', 'fire') NOT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `coords` VARCHAR(100) DEFAULT NULL,
  `status` ENUM('pending', 'active', 'completed', 'cancelled') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_caller` (`caller_number`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Hack Phone Tables
-- ==========================================

CREATE TABLE IF NOT EXISTS `phone_hack_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `hacker_device_id` VARCHAR(50) NOT NULL,
  `target_number` VARCHAR(20) NOT NULL,
  `action_type` ENUM('track', 'crack_pin', 'inject_message', 'query_db', 'camera_access') NOT NULL,
  `action_data` TEXT DEFAULT NULL,
  `success` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_hacker` (`hacker_device_id`),
  INDEX `idx_target` (`target_number`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `phone_tracking_data` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `target_number` VARCHAR(20) NOT NULL,
  `tracker_device_id` VARCHAR(50) NOT NULL,
  `coords` VARCHAR(100) NOT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_target` (`target_number`),
  INDEX `idx_tracker` (`tracker_device_id`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Settings & Preferences
-- ==========================================

CREATE TABLE IF NOT EXISTS `phone_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `phone_account_id` INT NOT NULL,
  `theme` ENUM('light', 'dark', 'auto') DEFAULT 'dark',
  `wallpaper` VARCHAR(255) DEFAULT NULL,
  `ringtone` VARCHAR(100) DEFAULT 'default',
  `vibration` BOOLEAN DEFAULT TRUE,
  `brightness` INT DEFAULT 80,
  `volume` INT DEFAULT 60,
  `notifications_enabled` BOOLEAN DEFAULT TRUE,
  `dnd_enabled` BOOLEAN DEFAULT FALSE,
  `dnd_start` TIME DEFAULT NULL,
  `dnd_end` TIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`phone_account_id`) REFERENCES `phone_accounts`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_account_settings` (`phone_account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cloud Backup
-- ==========================================

CREATE TABLE IF NOT EXISTS `phone_cloud_backups` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `phone_account_id` INT NOT NULL,
  `backup_data` LONGTEXT NOT NULL,
  `backup_size` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`phone_account_id`) REFERENCES `phone_accounts`(`id`) ON DELETE CASCADE,
  INDEX `idx_account` (`phone_account_id`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
