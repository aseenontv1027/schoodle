# Schoodle - Read Me

Schoodle is a useful scheduling and polling app which allows the user to create a poll on different times of the meeting. It is easily sharable with anyone who knows the link, and can be voted to decide when they want to meet up! 

## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information 
  - `DB_USER=postgres` or your database username
  - `DB_PASS=` or your database password
  - `DB_NAME=midterm` or your database name
  - `DB_PORT=5432`
  - `DB_HOST=localhost`
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Reset database: `npm run db:reset`
  - Check the db folder to see what gets created and seeded in the SDB
7. Run the server: `npm run local`
  - Note: nodemon is used, so you should not have to restart your server
8. Visit `http://localhost:8080/`

## App Flow
Welcome to Schoodle!

Give your meeting a title, a description, register your name and email, and pick your date & time options for the poll
<img width="1440" alt="Screen Shot 2021-06-21 at 2 08 09 AM" src="https://user-images.githubusercontent.com/55459461/122715078-5b7e4180-d236-11eb-9bba-7a23f6dd9a6d.png">
After created your meeting poll, you can choose to vote by entering your name and email. Or you can choose to vote later and send this poll to others by copying the unique url
<img width="1440" alt="Screen Shot 2021-06-21 at 2 09 03 AM" src="https://user-images.githubusercontent.com/55459461/122715098-60db8c00-d236-11eb-9fa2-7279dde38fc6.png">
The poll result is calculated in real-time
<img width="1440" alt="Screen Shot 2021-06-21 at 2 11 47 AM" src="https://user-images.githubusercontent.com/55459461/122715113-6638d680-d236-11eb-83ea-c84c0d29123c.png">

## APIs and Tech Stack

This project used JavaScript, CSS for the Frontend and Node.js for the Backend.
PostgreSQL is used for the database, and deployed on Heroku

Stack: JavaScript (jQuery, AJAX), Node.js, Express, CSS, Bootstrap, PostgreSQL, Heroku

## Authors

* Kaiteng Lo: https://www.linkedin.com/in/kaitengl1027/
* Darren Beattie: https://www.linkedin.com/in/dbeattie/
* Anisa Mohamed: https://www.linkedin.com/in/anisa-mohamed/

## Warnings & Tips

- Use the `npm run db:reset` command each time there is a change to the database schema or seeds. 
  - It runs through each of the files, in order, and executes them against the database. 
  - Note: you will lose all newly created (test) data each time this is run, since the schema files will tend to `DROP` the tables and recreate them.

## Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x

## License
This project is licensed under the LHL License
