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

// Helper Fn to generate 6 random alphanumeric characters
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
   .then(res => { return res.rows[0]});
};

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
  router.post("/:pollURL/submit", (req, res) => {
    res.redirect(`polls/${pollURL}`); //polls.id
  });

  // UPDATE Polls
  router.post("/:pollURL/update", (req, res) => {
    res.redirect(`polls/${pollURL}`); //polls.id
  });

  // GET polls/randomURL (generated polls page)
  router.get("/:pollURL", (req, res) => {
    res.render("show");
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
