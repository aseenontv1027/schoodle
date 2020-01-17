DROP TABLE IF EXISTS submissions CASCADE;

CREATE TABLE submissions (
  id SERIAL PRIMARY KEY NOT NULL,
  poll_id VARCHAR(255) NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  submitter_name VARCHAR(255),
  submitter_email VARCHAR(255),
  submission_time TIME
);

