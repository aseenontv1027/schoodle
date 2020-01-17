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

// Add polls by inserting a new poll into database
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
      return res.rows;
    });
  });
};

//STARTED BUT NOT FINISHED/NEEDED??
// // Returns the whole table data in an array
// const getTableDataByRow = function(url) {
//   const dataQuery = `SELECT submissions.submitter_name as name, poll_options.date_option as date, poll_options.time_option as time, submission_responses.submission_response as true_false
//   FROM polls
//   JOIN poll_options ON polls.id = poll_id
//   JOIN submission_responses ON poll_option_id = poll_options.id
//   JOIN submissions ON submission_id = submissions.id
//   WHERE polls.id = $1;`;

//   return db.query(dataQuery, [url]).then(res => {
//     return res.rows;
//   });
// };

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

//Get poll options
const queryForPollOptions = pollId => {
  const pollOptionsQuery = `SELECT poll_id, date_option, time_option, poll_options.id as id, polls.title as title, polls.description as description
  FROM poll_options
  JOIN polls ON polls.id = poll_id
  WHERE poll_id = $1;`;

  return db.query(pollOptionsQuery, [pollId]).then(res => {
    return res.rows;
  });
};

//Query database for PollId based on PollOptionId info
const getPollIdFromPollOptionId = pollOptionId => {
  const pollIdQuery = `
 SELECT poll_id FROM poll_options
 WHERE id = $1;`
  return db.query(pollIdQuery, [pollOptionId])
    .then(answer => {
      return answer.rows[0].poll_id;
});
};

//Returns a poll_option.id to find a poll.id, see getPollIdFromPollOptionId
const parsePollOptionIdOnSubmission = submissionData => {
  let indexReturn = Object.keys(submissionData);
  //This works only IF a poll_option.id is passed
  return indexReturn[0];
};

//Removed submitter_name & submitter_email from submission object
const removeNameEmail = submissionObj => {
  delete submissionObj['submitter_name'] && delete submissionObj['submitter_email']
  return submissionObj;
}

//HELPER FOR SORTING TRUE OR FALSE VALUES ASSOCIATED WITH A POLL_OPTION_ID
const trueOrFalse = (obj) => {
  const objKeyArr = Object.keys(obj);
  let falseString = '';
  let trueString = '';
  for (const id of objKeyArr) {
    if (obj[id] === 'true') {
      trueString += `'${id}',`;
    } else {
      falseString += `'${id}',`;
    }
  }
  return [trueString.slice(0, -1), falseString.slice(0, -1)];
};

const addSubmission = async data => {

  // console.log('DATA:', data)
  const submitterName = data.submitter_name;
  const submitterEmail = data.submitter_email;

  const pollOptionId = parsePollOptionIdOnSubmission(data);

  const pollOptionIdBoolean = removeNameEmail(data);

  const pollId = await getPollIdFromPollOptionId(pollOptionId);

  const pollIDSubmitterValues = [
      pollId,
      submitterEmail
  ];

  // console.log('DATA QUERY ARRAY', pollIDSubmitterValues);

  const pollIdSubmitterNameQuery = `
    SELECT * FROM submissions
    WHERE poll_id = $1 AND submitter_email = $2;`;

  return db.query(pollIdSubmitterNameQuery, pollIDSubmitterValues)
    .then(check => {

      //console.log('CHECK.ROWS[0].ID RETURNS:', check.rows[0].id);
      //console.log('SUBMISSIONID', submissionId);
      console.log('<SHOULD BE TRUE IF I ENTER darren.beattie@gmail.com --->', (check.rows.length > 0));

      if (check.rows.length > 0) {

        const submissionId = check.rows[0].id;
        console.log('IS THE TRUE INDEX FULL?', trueOrFalse(pollOptionIdBoolean)[0] !== '');

        if (trueOrFalse(pollOptionIdBoolean)[0] !== '') {

          //submissionId //
          //pollOptionIdBoolean //Obj with key = poll_option_id and value = true or false

          // console.log('HOW DOES TRUE OR FALSE FUNCTION RETURN?', trueOrFalse(pollOptionIdBoolean));
          console.log('SubmissionValues', submissionId);

          const updateQueryStartTrue = `
            UPDATE submission_responses
            SET submission_response = true
            WHERE submission_id = ${submissionId} AND poll_option_id IN (${trueOrFalse(pollOptionIdBoolean)[0]})
            RETURNING *;`

          console.log('updateQueryStartTrue AFTER:', updateQueryStartTrue);

          return db.query(updateQueryStartTrue)
            .then(result => {

              console.log('IF THERE ARE TRUE VALUES RESULT', result.rows);
              if ((trueOrFalse(pollOptionIdBoolean)[1] !== '')) {

                console.log('RESULT.ROWS:', result.rows);
                console.log('pollOptionIdBoolean', pollOptionIdBoolean);
                const updateQueryStartFalse = `
                  UPDATE submission_responses
                  SET submission_response = false
                  WHERE submission_id = ${submissionId} AND poll_option_id IN (${trueOrFalse(pollOptionIdBoolean)[1]})
                  RETURNING *;`

              return db.query(updateQueryStartFalse)
                .then(result => {
                  return result;
                });

              } else {
                console.log('LAST ELSE STATEMENT RESULT:', result.rows);
                return db.query(result.rows)
                .then(lastResult => {
                  return lastResult;
                });
                // return db.query(updateQueryStartFalse)
                // .then(result => {
                //   return result;
                // });
              }

            });

          } else {

            const updateQueryStartFalse = `
                UPDATE submission_responses
                SET submission_response = false
                WHERE submission_id = ${submissionId} AND poll_option_id IN (${trueOrFalse(pollOptionIdBoolean)[1]});`

            console.log('updateQueryStartFalse AFTER:', updateQueryStartFalse);

            return db.query(updateQueryStartFalse)
              .then(result => {
                return result;
              });
          }

      } else {

        const insertSubmissionValues = [
          pollId,
          submitterName,
          submitterEmail
        ];

        console.log('INSERT QUERY ARRAY', insertSubmissionValues);

        let insertQuery = `
          INSERT INTO submissions (poll_id, submitter_name, submitter_email)
          VALUES ($1,$2,$3)
          RETURNING * ;`;

        return db.query(insertQuery, insertSubmissionValues)
          .then(response => {

            console.log('RESPONSE.ROWS:', response.rows)

            // [ anonymous {
            //   id: 96,
            //   poll_id: '4',
            //   submitter_name: 'Darren Beattie',
            //   submitter_email: 'darren.beattie@wmail.com',
            //   submission_time: null } ]

            let submissionResponseQuery = "";

            const submissionResponseStart = `
              INSERT INTO submission_responses (poll_option_id, submission_id, submission_response)
              VALUES `;

            const submissionResponseEnd =  `
              ;`
              // ON CONFLICT (submission_id, poll_option_id)
              // DO UPDATE SET submission_response = EXCLUDED.submission_response;`

            submissionResponseQuery += submissionResponseStart;

            const booleanSubmissionLoop = (submissionResponses, pollId) => {
              let returnStr = ``
              for (const id in submissionResponses) {
                returnStr += `('${id}', '${pollId[0].id}', '${submissionResponses[id]}'),`
              }
              return returnStr.slice(0, -1);
            }

            submissionResponseQuery += booleanSubmissionLoop(pollOptionIdBoolean, response.rows);

            submissionResponseQuery += submissionResponseEnd;

            //console.log('submissionResponseQuery', submissionResponseQuery);

            return db.query(submissionResponseQuery).then(response => {
              // console.log('res.rows AFTER QUERY:', res.rows);
              return response;
            });
        });
      };
    });
};


// Routes -----------------------------------------------------------------------
module.exports = db => {

  // Create New Poll Route
  router.post("/", (req, res) => {
    addPoll({ ...req.body })
      .then(poll => {
        res.redirect(`/polls/${poll[0].poll_id}`);
      })
      .catch(e => {
        console.error(e);
        res.send(e);
      });
  });

  // Submit new response to poll
  router.post("/:pollURL/submit", (req, res) => {
    addSubmission({ ...req.body })
      .then(submission => {
        // console.log('addSubmission PROMISE RETURN:', submission); //find out the structure of req.body
        res.redirect(`/polls/${req.params.pollURL}`);
      })
      .catch(e => {
        console.error(e);
        res.send(e);
    });
  });

  // // Submit response to poll
  // router.post("/:pollURL/submit", (req, res) => {
  //   //insert to database
  //   // console.log(req.body, '<--- This is req.body broooooooooo'); //find out the structure of req.body
  //   console.log(req.params.pollURL);

  //   res.redirect(`/polls/${req.params.pollURL}`); //polls.id
  //    //res.redirect('/polls/'+'polls'); //polls.id
  // });

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
            res.render("show", { polls: results, pollURL: req.params.pollURL });
          });
          //NOT USING THIS YET??
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
