DROP TABLE IF EXISTS submission_responses CASCADE;

CREATE TABLE submission_responses(
  poll_option_id VARCHAR(255) NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
  submission_id VARCHAR(255) NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  submission_response BOOLEAN
);
