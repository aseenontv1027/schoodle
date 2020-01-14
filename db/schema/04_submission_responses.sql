DROP TABLE IF EXISTS submission_responses CASCADE;
CREATE TABLE submission_responses(
  poll_option_id INTEGER NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
  submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  submission_response BOOLEAN,
  PRIMARY KEY (submission_id,poll_option_id)

);
