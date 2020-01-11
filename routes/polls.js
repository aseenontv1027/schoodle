const express = require('express');
const router = express.Router();

// Resource: poll
// get all GET     /polls
// get     GET     /polls/:id
// create  POST    /polls
// delete  DELETE  /polls/:id
// update  PUT     /polls/:id

const generateRandomString = function() {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let length = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * length));
  }
  return result;
};


module.exports = (db) => {
  // CREATE New Poll
  router.post("/", (req, res) => {
    // Get poll data from form

    let pollURL = String(generateRandomString());

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
    res.redirect(`/${pollURL}`);
  });

  // UPDATE Polls
  router.post("/:pollURL/update", (req, res) => {
    res.redirect(`/${pollURL}`);
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
