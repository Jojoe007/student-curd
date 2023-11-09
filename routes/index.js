var express = require('express');
var router = express.Router();
var mysql = require('mysql2');

const connection = mysql.createConnection({
  host: "utcccs.cj5octuotk3f.ap-northeast-1.rds.amazonaws.com",
  user: "myuser",
  password: "myuser1234",
  port: "3306",
  database: "SP343"
});

/* GET home page. */
router.get('/', function (req, res, next) {
  try {
    connection.query(
      'SELECT * FROM student',
      function (err, results, fields) {
        if (err) {
          res.status(500).send(err.message);
        };

        res.render('index', { students: results });
      }
    );
  } catch (err) {
    res.status(500).send(err.message);
  }
});


/* GET students create page */
router.get('/create', function (req, res, next) {
  res.render('create');
});

/* POST create student */
router.post('/create', function (req, res, next) {
  const { id, first_name, last_name, major, year } = req.body;

  try {
    connection.query(
      'INSERT INTO student (std_id, std_fname, std_lname, std_major, std_year) VALUES (?, ?, ?, ?, ?)',
      [id, first_name, last_name, major, year],
      function (err, results, fields) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(results);
        }
      }
    );
  } catch (err) {
    res.status(500).send(err.message);
  };
});

/* GET students create success page */
router.get('/success', function (req, res, next) {
  res.render('success');
});

/* GET edit student page */
router.get('/edit/:id', function (req, res, next) {
  const { id } = req.params;

  try {
    connection.query(
      'SELECT * FROM student WHERE std_id = ?',
      [id],
      function (err, results, fields) {
        if (err) {
          res.status(404).send(err.message);
        };

        if (results.length > 0) {
          res.render('edit', { student: results[0] });
        } else {
          res.status(404).send("Students not found.");
        }
      }
    );
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* PUT edit student */
router.put('/edit/:id', function (req, res, next) {
  const { id, first_name, last_name, major, year } = req.body;
  console.log(req.body);
  try {
    connection.query(
      'UPDATE student SET std_id = ?, std_fname = ?, std_lname = ?, std_major = ?, std_year = ? WHERE std_id = ?',
      [id, first_name, last_name, major, year, id],
      function (err, results, fields) {
        if (err) {
          res.status(400).send(err.message);
        } else {
          res.status(200).send(results);
        }
      }
    );
  } catch (err) {
    res.status(500).send(err.message);
  };
});

/* GET edit student page */
router.delete('/delete/:id', function (req, res, next) {
  const { id } = req.params;

  try {
    connection.query(
      'DELETE FROM student WHERE std_id = ?',
      [id],
      function (err, results, fields) {
        if (err) {
          res.status(400).send(err.message);
        } else {
          res.status(200).send(results);
        }
      }
    );
  } catch (err) {
    res.status(500).send(err.message);
  };
});

module.exports = router;
