const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const dbParams = require("../lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Resource: poll
// get all GET     /polls
// get     GET     /polls/:id
// create  POST    /polls
// delete  DELETE  /polls/:id
// update  PUT     /polls/:id

// Helper Functions --------------------------------------------------------------------
// Generate 6 random alphanumeric characters
const generateRandomString = function() {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let length = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * length));
  }
  return result;
};

// Add polls by inserting a new poll into database
const addPoll = data => {
  let pollURL = String(generateRandomString());
  const dataValues = [
    // data.id,
    pollURL,
    data.title,
    data.description,
    data.creator_name,
    data.creator_email
  ];
  console.log(dataValues, '<--- data values')
  const dataQuery = `INSERT INTO polls
  (id, title, description, creator_name, creator_email)
  VALUES ($1,$2,$3,$4,$5)
  RETURNING * ;`;

  return db.query(dataQuery, dataValues)
   .then(res => {
    console.log('This is res.rows!!!!' + res.rows);
    return res.rows[0]});
};

// p5RFDa
//




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




const getDate = (dateTime) => {
  dateTimeArray = dateTime.split('T');
  return dateTimeArray[0];
}
const getTime = (dateTime) => {
  dateTimeArray = dateTime.split('T');
  return dateTimeArray[1];
}

module.exports = db => {
  // CREATE New Poll
  router.post("/", (req, res) => {
    // Get poll data from form
    //let pollURL = String(generateRandomString());

    addPoll({ ...req.body })
      .then(poll => {

        res.redirect(`polls/${poll.id}`)})
      .catch(e => {
        console.error(e);
        res.send(e);
      });

    //['7d0dgksah30', 'My Poll 1', 'This is test poll 1', 'D B', 'db@db.com']

    // const poll = {
    //   id: 'theNewPoll', // random generated string
    //   title: req.body.title,
    //   description: '',
    //   creator_name: '',
    //   creator_email: '',
    // }

    // res.json(req.body);

    // req.body
    // {
    //   title: '',
    //   description: '',
    //   creator_name: '',
    //   creator_email: '',
    //   options: ['asdasd'],
    // }

    // validate data

    // insert into database

    // redirect to poll/:id
  });

  // Polls Submission
  router.post("/submit", (req, res) => {
    res.redirect(`polls/${pollURL}`); //polls.id
  });

  // UPDATE Polls
  router.post("/update", (req, res) => {
    res.redirect(`polls/${pollURL}`); //polls.id
  });

  // GET polls/randomURL (generated polls page)
  router.get("/:pollURL", (req, res) => {

    const counter = 0;

    console.log(`This is req.params.pollURL ${req.params.pollURL}`);

    showDatabaseTableByRow(counter, req.params.pollURL)
    .then(rowsArr => {
      console.log('This is rowsArr!!!!!!!!!!!!!!' + rowsArr);

      const templateVar = {};




      res.render("show");
    })
    .catch(e => {
      console.error(e);
      res.send(e);
    });




  });

  // GET Polls (home route)
  router.get("/", (req, res) => {
    res.render("index");
  });

  return router;
};

// ---------------------------------------------------------------

// module.exports = (db) => {
//   router.get("/", (req, res) => {
//     db.query(`SELECT * FROM users;`)
//       .then(data => {
//         const polls = data.rows;
//         res.render('polls', { polls });
//       })
//       .catch(err => {
//         res
//           .status(500)
//           .json({ error: err.message });
//       });
//   });
//   return router;
// };

// --------------------------------------------------------------
// router.get("/polls", (req, res) => {
//   db.query(`SELECT * FROM polls;`)
//     .then(data => {
//       const polls = data;
//       res.json({ polls });
//     })
//     .catch(err => {
//       res
//         .status(500)
//         .json({ error: err.message });
//     });
// });
