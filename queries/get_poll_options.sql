SELECT poll_id, date_option, time_option
FROM poll_options
WHERE poll_id = `${}` ;
 --where all poll ids match a submission reference these submission in the poll response table
-- SELECT * FROM poll_options
-- JOIN ON poll_id = polls.id
-- WHERE poll_id = `cpmes`;
INSERT INTO poll_options (poll_id, date_option, time_option)
VALUES ('pollid url','input date', 'input time')
ON CONFLICT (time_option) DO NOTHING;

--from table above

 INSERT INTO submissions (poll_id, submitter_name, submitter_email)
 VALUES ('pollid url', 'name from form', 'email from form')
--from table above

--then pass in submission id from submission on the endpoint /submit



