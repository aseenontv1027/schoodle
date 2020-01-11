DROP TABLE IF EXISTS polls CASCADE;

CREATE TABLE polls (
  id VARCHAR(255) PRIMARY KEY NOT NULL,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  creator_name VARCHAR(255),
  creator_email VARCHAR(255)
);
