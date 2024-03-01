const db =require("../models/db.js")

DROP DATABASE facebook;


CREATE DATABASE facebook;
USE facebook;
CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(65535) NOT NULL,
    country VARCHAR(255),
    city VARCHAR(255),
    date_of_birth DATE,
        bio TEXT,
    profile_picture VARCHAR(2048),
    cover_photo VARCHAR(255),
    location VARCHAR(100),
    role_id INT,
    role_name TEXT,
    --  userLoginTime TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)

);
CREATE TABLE user_role (
    user_role_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    role_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id),
    UNIQUE KEY unique_user_role (user_id, role_id)
);


CREATE TABLE posts (
post_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY ,
user_id INT ,
content TEXT NOT NULL,
 visibility ENUM('public', 'private', 'friends') DEFAULT 'public',
 photo TEXT,
likes_count INT DEFAULT 0,
comments_count INT DEFAULT 0,
shares_count INT DEFAULT 0,
feeling TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(user_id)
);



CREATE TABLE comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);
CREATE TABLE likes (
    like_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    -- comment_id INT,
    post_id INT, 
      FOREIGN KEY (user_id) REFERENCES users(user_id),
    -- FOREIGN KEY (comment_id) REFERENCES comments(comment_id),
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
   post_likes_count INT DEFAULT 0,
  comment_likes_count INT DEFAULT 0
);

-- CREATE TABLE notifications (
--     notification_id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id INT NOT NULL,
--     notification_type ENUM('like', 'comment') NOT NULL,
--     item_id INT NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     is_read BOOLEAN DEFAULT FALSE,
--     FOREIGN KEY (user_id) REFERENCES users(user_id),
     
-- );


CREATE TABLE private_messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message_text TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    is_delete BOOLEAN DEFAULT FALSE,
   attachment_url VARCHAR(500) DEFAULT NULL,
    delivery_status VARCHAR(50) DEFAULT 'pending',
    FOREIGN KEY (sender_id) REFERENCES users(user_id),
    FOREIGN KEY (receiver_id) REFERENCES users(user_id)
);

CREATE TABLE photos (
    photo_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    photo_url VARCHAR(255) NOT NULL,
    caption TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE TABLE settings (
    setting_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    dark_mode BOOLEAN DEFAULT FALSE,
    language VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE TABLE status_updates (
    status_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    status_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE TABLE advertisements (
    ad_id INT AUTO_INCREMENT PRIMARY KEY,
    ad_name VARCHAR(100) NOT NULL,
    ad_description TEXT,
    ad_image_url VARCHAR(255),
    start_date DATE,
    end_date DATE,
    ad_cost DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT FALSE
);
CREATE TABLE groups (
    group_id INT AUTO_INCREMENT PRIMARY KEY,
    group_name VARCHAR(100) NOT NULL,
    group_description TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);
CREATE TABLE friends (
    friendship_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
   friend_id INT NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'None',
    action_user_id INT,
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (friend_id) REFERENCES users(user_id),
    FOREIGN KEY (action_user_id) REFERENCES users(user_id)
);
CREATE TABLE search_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    search_term VARCHAR(255) NOT NULL,
    search_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

