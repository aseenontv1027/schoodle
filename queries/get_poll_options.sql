SELECT poll_id, date_option, time_option
FROM poll_options
WHERE poll_id = `${}`;
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




INSERT INTO user_logins (username, logins)
VALUES ('Naomi',1),('James',1)
ON CONFLICT (username)

DO UPDATE SET logins = user_logins.logins + EXCLUDED.logins;
  INSERT INTO
    poll_options (poll_id, date_option, time_option)
  VALUES (

4,'2021-10-14', '04:09:00'
    FROM
      unnest( id) AS unnested_column
  );
insert into poll_options (poll_id, date_option, time_option) values(4,'2021-10-14', '04:09:00')
