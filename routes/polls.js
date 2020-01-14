const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const dbParams = require("../lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Resource: poll
// get all GET     /polls/new
// get     GET     /polls/:id
// create  POST    /polls/new
// delete  DELETE  /polls/:id
// update  PUT     /polls/:id

// Helper Functions --------------------------------------------------------------------

//Pass the number of characters you'd like to produce as a random string
const generateRandomString = (length) => {
  return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
};

// Add polls by inserting a new poll into database -- CURRENTLY does not post options to poll_options table
const addPoll = data => {
  let pollURL = generateRandomString(16);
  const dataValues = [
    pollURL,
    data.title,
    data.description,
    data.creator_name,
    data.creator_email
  ];

  const dataQuery = `INSERT INTO polls
  (id, title, description, creator_name, creator_email)
  VALUES ($1,$2,$3,$4,$5)
  RETURNING * ;`;

  return db.query(dataQuery, dataValues)
   .then(res => {
    console.log('This is res.rows!!!!' + res.rows);
    return res.rows[0]});
};

const showDatabaseTableByRow = function(counter, url) {
  const dataQuery = `SELECT submissions.submitter_name as submitter, poll_options.date_option as date, poll_options.time_option as time, submission_responses.submission_response as true_false
  FROM polls
  JOIN poll_options ON polls.id = poll_id
  JOIN submission_responses ON poll_option_id = poll_options.id
  JOIN submissions ON submission_id = submissions.id
  WHERE polls.id = $1;`;

  const dataValues = [url];
  const pollSummiters = [];
  console.log('This is dataValues bro: ', dataValues);
  return db.query(dataQuery, dataValues)
  .then(res => {
    console.log('This is just res', res);

    res.rows.forEach(submitter => {
      console.log(`NAME: ${submitter.submitter}, DATE: ${submitter.date}, TIME: ${submitter.time}, CHECKED: ${submitter.true_false}`);
    });
    return res.rows;
  });
};

const checkIfPollIdExists = (id) => {
  const idQuery =
  ` SELECT id
    FROM polls
    WHERE id =  $1 `;
  return db.query(idQuery, [id])
  .then(res => {
    console.log(res.rows,'<--- data values')
    return res.rows.length === 1})
}

const getDate = (dateTime) => {
  dateTimeArray = dateTime.split('T');
  return dateTimeArray[0];
}

const getTime = (dateTime) => {
  dateTimeArray = dateTime.split('T');
  return dateTimeArray[1];
}

module.exports = db => {

  // Create New Poll
  router.post("/", (req, res) => {
    // Get poll data from form
    addPoll({ ...req.body })
      .then(poll => {
        res.redirect(`/polls/${poll.id}`)})
      .catch(e => {
        console.error(e);
        res.send(e);
      });

  });

  // Submit response to poll
  router.post("/submit", (req, res) => {
     res.redirect(`/${pollURL}`); //polls.id
  });

  // Update response to poll
  router.post("/update", (req, res) => {
    res.redirect(`/${pollURL}`); //polls.id
  });

  // GET Polls (home route)
  router.get("/new", (req, res) => {
    res.render("index");
  });
   // GET Polls (home route)
   router.get("/", (req, res) => {
    res.redirect('/new')
  });

  // GET polls/randomURL (generated polls page)
  router.get("/:pollURL", (req, res) => {
    checkIfPollIdExists(req.params.pollURL)
    .then((exists) => {
      if (exists) {
        const counter = 0;
        console.log(`This is req.params.pollURL ${req.params.pollURL}`);
        return showDatabaseTableByRow(counter, req.params.pollURL).then(
          rowsArr => {
          console.log('This is rowsArr!!!!!!!!!!!!!!' + rowsArr);
          const templateVar = {};
          res.render("show");
          });
      } else {
        res.redirect('/polls/new');
        return null;
      }
    })
    .catch(e => {
      console.error(e);
      res.send(e);
    });
  });

  return router;

};

