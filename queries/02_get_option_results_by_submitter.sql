SELECT submissions.submitter_name as submitter, poll_options.date_option as date, poll_options.time_option as time, submission_responses.submission_response as true_false
FROM polls
JOIN poll_options ON polls.id = poll_id
JOIN submission_responses ON poll_option_id = poll_options.id
JOIN submissions ON submission_id = submissions.id
WHERE submitter LIKE '%${}'
