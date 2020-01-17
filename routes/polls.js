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
  const pollOptionsQuery = `SELECT poll_id, date_option, time_option, poll_options.id as id, polls.title as title, polls.description as description, polls.id as polls_id
  FROM poll_options
  JOIN polls ON polls.id = poll_id
  WHERE poll_id = $1;`;
  return db.query(pollOptionsQuery, [pollId]).then(res => {
    //console.log("WHAT IS RES?", res.rows);
    return res.rows;
  });
};

// Retrieve submission data with given polls.id
const queryForSubmissions = resultObj => {
  const submissionQuery = `
  SELECT submissions.id as id, submissions.poll_id as poll_id, submissions.submitter_name as user_name, submission_responses.poll_option_id as poll_option_id, submission_responses.submission_response as boolean
  FROM submissions
  JOIN submission_responses ON submission_id = submissions.id
  WHERE poll_id = $1;`;

  console.log([resultObj[0].polls_id]);

  return db.query(submissionQuery, [resultObj[0].polls_id]).then(res => {
    console.log(res.rows, '<--------- This is res.rows in submissionQuery');
    return res.rows;
  });
};

const formatAMPM = function(date) {
  console.log(typeof(date));
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  let strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
};

const checkEmailPerPoll = function(Obj) {
  const queryWithURL = `
  SELECT submissions.id as submission_id, submissions.poll_id as poll_id, submissions.submitter_name as name, submissions.submitter_email as email
  FROM submissions
  JOIN polls ON submissions.poll_id = polls.id
  JOIN poll_options ON polls.id = poll_options.poll_id
  WHERE polls.id = $1;`;

  const insertInto = `
  INSERT INTO submissions
  (poll_id, submitter_name, submitter_email)
  VALUES ($1,$2,$3)
  RETURNING * ;`

  const startInsertIntoResponse = `
  INSERT INTO submission_responses
  (submission_id, poll_option_id, submission_response)
  VALUES
  `;



  let insertIntoResponse = '';

  console.log(Obj, '<-- OBJJJJJJJJJJJJ');


  return db.query(queryWithURL, [Obj.url]).then(res => {
    console.log(res.rows, 'commmmmeeee on');
    if (res.rows.length === 0) {
      console.log('heheheyeyeyeyeeyeheheheheh');
      return db.query(insertInto, [Obj.url, Obj.form.submitter_name, Obj.form.submitter_email]).then(
          res => {
            console.log(res.rows, 'asdfasdfasdfwowwowowowowowowowowowwwwwwwWWWWWWWWWWWWw')
            const pollOptionArr = [];
            const booleanArr = [];
            const formKeyArr = Object.keys(Obj.form);
            const formValueArr = Object.values(Obj.form);

            formKeyArr.forEach(key => {
              if (Number(key)) {
                pollOptionArr.push(Number(key));
              }
            });

            formValueArr.forEach(value => {
              if (value === 'true' || value === 'false') {
                booleanArr.push(value);
              }
            });

            console.log(pollOptionArr, "pollOptionArr yo~");
            console.log(booleanArr, "booleanArr yo~");

            insertIntoResponse = insertIntoResponse + startInsertIntoResponse;

            for (let i = 0; i < pollOptionArr.length; i++) {
              insertIntoResponse = insertIntoResponse + `
              (${res.rows[0].id},${pollOptionArr[i]},${booleanArr[i]})
              `;
              if (i === pollOptionArr.length - 1) {
                insertIntoResponse = insertIntoResponse + 'RETURNING *;';
              } else {
                insertIntoResponse = insertIntoResponse + ', ';
              }
            }
            return db.query(insertIntoResponse).then(res => {
              console.log(res.rows, "insertion yoyoyoyoyoyoy");
              return res.rows;
            })
        }
      )
    } else {
      console.log('Nahhhhhhhhh');
      return db.query(queryWithURL, [Obj.url]).then(res => {
        console.log(res.rows, "Now we have something!");
        for (submissionData of res.rows) {
          if (submissionData.email === Obj.form.submitter_email) {




            const update = `
            UPDATE submission_responses
            SET submission_response = true
            WHERE submission_id =
            `

            return


          } else {
            //


            res.redirect(`/`);
          }
        }

      });



    }

  });
};

// Routes -----------------------------------------------------------------------
module.exports = db => {
  // Create New Poll
  router.post("/", (req, res) => {
    // Get poll data from form
    addPoll({ ...req.body })
      .then(poll => {
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

    console.log(req.body, '<--- This is req.body broooooooooo'); //find out the structure of req.body

    const url = req.params.pollURL;
    const form = req.body;
    const Obj = {};
    Obj['url'] = url;
    Obj['form'] = form;

    checkEmailPerPoll(Obj)
    .then(a => {
      console.log(a, 'asdfasdfasdfasdfasdfsd')
      res.redirect(`/`);
    })
  });

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

            console.log(results, '<--- This is the results bruv');

            queryForSubmissions(results).then(tableArr => {

              console.log(tableArr, '<---------------- talbeArr');

              // Get the total row data
              const total ={};
              tableArr.forEach(responseData => {
                let key = responseData.poll_option_id;
                if (key in total) {
                  if (responseData.boolean) {
                    total[key]++;
                  }
                } else {
                  if (responseData.boolean) {
                    total[key] = 1;
                  } else {
                    total[key] = 0;
                  }
                }
              });

              console.log(total, '<---------- This is total')

              console.log(results, '<-----------resuuuuUlt');

              // results.forEach(resultData => {
              //   resultData.data_option = formatAMPM(resultData.data_option);
              //   console.log(formatAMPM(resultData.data_option));
              // })

              // console.log(results, '<-----------resuuuuUlt');

              res.render("show", { polls: results, table: tableArr, countTotal: total});
            });

          });
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
