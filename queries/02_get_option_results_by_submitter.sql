-- this query gets the all submitter names in a given poll id
SELECT submissions.submitter_name as submitter, poll_options.date_option as date, poll_options.time_option as time, submission_responses.submission_response as true_false
FROM polls
JOIN poll_options ON polls.id = poll_id
JOIN submission_responses ON poll_option_id = poll_options.id
JOIN submissions ON submission_id = submissions.id
WHERE submitter LIKE '%${}'
WHERE poll_id LIKE '%${}'

-- this query get all submissions in a poll from a given email
SELECT * FROM poll_options
JOIN submission_responses
ON poll_options.id =  submission_responses.poll_option_id
JOIN submissions
ON submissions.id = submission_responses.submission_id
WHERE submissions.submitter_email = '4 fake email'
and poll_options.poll_id  = '4';

-- this query inserts into a poll by either inserting a new submission or updating an existing one
INSERT INTO submission_responses(submission_id, poll_option_id, submission_response)
VALUES(1,1,false)
ON CONFLICT (submission_id, poll_option_id)
DO UPDATE SET submission_response = EXCLUDED.submission_response;
