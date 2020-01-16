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

  const lengthOfTime = data.option.length;

  let dataQuery = `INSERT INTO polls
  (id, title, description, creator_name, creator_email)
  VALUES ($1,$2,$3,$4,$5)
  RETURNING * ;`;

  // console.log(dataQuery);

  return db.query(dataQuery, dataValues).then(res => {
    let timeQuery = "";
    let timeQueryStart = `INSERT INTO poll_options (poll_id, date_option, time_option)
      VALUES `;

    const timeQueryLoop = counter => {
      let queryLoop = `
        ('${res.rows[0].id}', '${getDate(data.option[counter])}', '${getTime(
        data.option[counter]
      )}')
        `;
      return queryLoop;
    };

    timeQuery = timeQuery + timeQueryStart;
    for (let i = 0; i < lengthOfTime; i++) {
      if (i === lengthOfTime - 1) {
        timeQuery = timeQuery + timeQueryLoop(i);
      } else {
        timeQuery = timeQuery + timeQueryLoop(i) + ", ";
      }
    }

    timeQuery = timeQuery + "RETURNING poll_id;";
    return db.query(timeQuery).then(res => {
      //console.log("TTTTThis is ", res);
      return res.rows;
    });
  });
};

// Returns the whole table data in an array
const getTableDataByRow = function(url) {
  const dataQuery = `SELECT submissions.submitter_name as name, poll_options.date_option as date, poll_options.time_option as time, submission_responses.submission_response as true_false
  FROM polls
  JOIN poll_options ON polls.id = poll_id
  JOIN submission_responses ON poll_option_id = poll_options.id
  JOIN submissions ON submission_id = submissions.id
  WHERE polls.id = $1;`;

  return db.query(dataQuery, [url]).then(res => {
    //console.log(res.rows, "<--- tableData values");
    return res.rows;
  });
};

const checkIfPollIdExists = id => {
  const idQuery = ` SELECT id
    FROM polls
    WHERE id =  $1;`;
  return db.query(idQuery, [id]).then(res => {
    return res.rows.length === 1;
  });
};

const getDate = dateTime => {
  dateTimeArray = dateTime.split("T");
  return dateTimeArray[0];
};

const getTime = dateTime => {
  dateTimeArray = dateTime.split("T");
  return dateTimeArray[1];
};
//get poll options
const queryForPollOptions = pollId => {
  const pollOptionsQuery = `SELECT poll_id, date_option, time_option, poll_options.id as id, polls.title as title, polls.description as description
 FROM poll_options
 JOIN polls ON polls.id = poll_id
 WHERE poll_id = $1;`;
  return db.query(pollOptionsQuery, [pollId]).then(res => {
    //console.log("WHAT IS RES?", res.rows);
    return res.rows;
  });
};

// Routes -----------------------------------------------------------------------
module.exports = db => {
  // Create New Poll
  router.post("/", (req, res) => {
    // Get poll data from form
    addPoll({ ...req.body })
      .then(poll => {
        //console.log("Heyyyyyyyyyy", poll);

        res.redirect(`/polls/${poll[0].poll_id}`);
      })
      .catch(e => {
        console.error(e);
        res.send(e);
      });
  });

  // Submit response to poll
  router.post("/:pollURL/submit", (req, res) => {
    //insert to database
    // console.log(req.body, '<--- This is req.body broooooooooo'); //find out the structure of req.body
    console.log(req.params.pollURL);

    res.redirect(`/polls/${req.params.pollURL}`); //polls.id
     //res.redirect('/polls/'+'polls'); //polls.id
  });

  // UPDATE Polls
  // router.post("/update", (req, res) => {
  //   res.redirect(`/${pollURL}`); //polls.id
  // });

  // GET Polls (home route)
  router.get("/new", (req, res) => {
    res.render("index");
  });
  // GET Polls (home route)
  router.get("/", (req, res) => {
    res.redirect("/new");
  });


  // GET polls/randomURL (generated polls page)
  router.get("/:pollURL", (req, res) => {
    checkIfPollIdExists(req.params.pollURL)
      .then(exists => {
        if (exists) {
          queryForPollOptions(req.params.pollURL).then(results => {
            //console.log("THIS IS RESPONSE AFTER PROMISE", res);
            console.log(results, '<--- This is the results bruv')
            res.render("show", { polls: results, pollURL: req.params.pollURL });
          });
          //getTableDataByRow(req.params.pollURL)
          // .then(tableData => {
          // //console.log(tableData, '<--- tableData again');
          // res.render("show");
          // });
        } else {
          res.redirect("/polls/new");
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
