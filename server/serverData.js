require("dotenv").config();

const express = require("express");
const app = express();
const mysql = require("mysql");
const sanitizeHtml = require("sanitize-html");
const pool = require("./config/database.js");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const cors = require("cors");
const { checkToken } = require("./config/checkToken.js");
const {
  sendingGet,
  sendingGetError,
  sendingGetById,
  sendingPost,
  sendingPut,
  sendingDelete,
  sendingInfo,
} = require("./config/sending.js");

//#region Middleware
//json-al kommunikáljon
app.use(express.json());
// mindenkivel enged kommunikálni
app.use(
  cors({
    origin: "*", //http://localhost:8080
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
//autentikáció
app.use(checkToken);
//#endregion Middleware

//#region Users ---
app.get("/users", (req, res) => {
  let sql = `SELECT * FROM users`;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(sql, async function (error, results, fields) {
      sendingGet(res, error, results);
    });
    connection.release();
  });
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  let sql = `
    SELECT * FROM users
    WHERE id = ?`;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(sql, [id], async function (error, results, fields) {
      sendingGetById(res, error, results, id);
    });
    connection.release();
  });
});

//user létrehozás
app.post("/users", (req, res) => {
  const salt = genSaltSync(10);
  req.body.password = hashSync(req.body.password, salt);
  const newR = {
    firstName: mySanitizeHtml(req.body.firstName),
    lastName: mySanitizeHtml(req.body.lastName),
    gender: mySanitizeHtml(req.body.gender),
    userName: mySanitizeHtml(req.body.userName),
    email: mySanitizeHtml(req.body.email),
    password: req.body.password,
    number: +mySanitizeHtml(req.body.number),
  };

  //user ellenőrzés
  let sql = `select count(*) countUserEmail from users where userName = ?
    UNION all
    select count(*) countEmail from users where email = ?`;
  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(
      sql,
      [newR.userName, newR.email],
      function (error, result, fields) {
        if (error) {
          sendingInfo(res, 0, "server error", [], 200);
          return;
        }
        if (result[0].countUserEmail >= 1 && result[1].countUserEmail >= 1) {
          sendingInfo(
            res,
            -3,
            "Username and password are already taken",
            newR,
            200
          );
          return;
        } else if (result[0].countUserEmail >= 1) {
          sendingInfo(res, -2, "Username are already taken", newR, 200);
          return;
        } else if (result[1].countUserEmail >= 1) {
          sendingInfo(res, -1, "Email are already taken", newR, 200);
          return;
        }
        //mehet a regisztráció

        sql = `insert into users
      (firstName, lastName, gender, userName, email, password, number)
      values
      (?,?,?,?,?,?,?)
    `;
        connection.query(
          sql,
          [
            newR.firstName,
            newR.lastName,
            newR.gender,
            newR.userName,
            newR.email,
            newR.password,
            newR.number,
          ],
          function (error, result, fields) {
            sendingPost(res, error, result, newR);
          }
        );
      }
    );
    connection.release();
  });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  let sql = `
    DELETE FROM users
    WHERE id = ?`;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(sql, [id], function (error, result, fields) {
      sendingDelete(res, error, result, id);
    });
    connection.release();
  });
});

app.put("/users/:id", (req, res) => {
  const id = req.params.id;
  const salt = genSaltSync(10);
  let password = req.body.password;
  password = hashSync(password, salt);

  const newR = {
    firstName: mySanitizeHtml(req.body.firstName),
    lastName: mySanitizeHtml(req.body.lastName),
    gender: mySanitizeHtml(req.body.gender),
    userName: mySanitizeHtml(req.body.userName),
    email: mySanitizeHtml(req.body.email),
    password: password,
    number: +mySanitizeHtml(req.body.number),
  };
  let sql = `
    UPDATE users SET
    firstName = ?,
    lastName = ?,
    gender = ?,
    userName = ?,
    email = ?,
    password = ?,
    number = ?
    WHERE id = ?
      `;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(
      sql,
      [
        newR.firstName,
        newR.lastName,
        newR.gender,
        newR.userName,
        newR.email,
        newR.password,
        newR.number,
        id,
      ],
      function (error, result, fields) {
        sendingPut(res, error, result, id, newR);
      }
    );
    connection.release();
  });
});

//#endregion Users

//#region opus ---
//A függvény egy promisszal tér vissza
function getOpus(res, opusId) {
  return new Promise((resolve, reject) => {
    let sql = `
    SELECT * from opus
    WHERE id = ?`;

    pool.getConnection(function (error, connection) {
      if (error) {
        sendingGetError(res, "Server connecting error!");
        return;
      }
      connection.query(sql, [opusId], async function (error, results, fields) {
        if (error) {
          const message = "Opus sql error";
          sendingGetError(res, message);
        }
        //Az await miatt a loaning.opus a results-ot kapja értékül
        resolve(results);
      });
      connection.release();
    });
  });
}

//Csak a opus tábla
app.get("/opus", (req, res) => {
  let sql = `SELECT * FROM opus`;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(sql, async function (error, results, fields) {
      if (error) {
        message = "Opus sql error";
        sendingGetError(res, message);
        return;
      }
      sendingGet(res, null, results);
    });
    connection.release();
  });
});

//Opus a specimen-jeivel
app.get("/opusWithSpecimen", (req, res) => {
  let sql = `SELECT * FROM opus`;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(sql, async function (error, results, fields) {
      if (error) {
        message = "Opus sql error";
        sendingGetError(res, message);
        return;
      }

      //Végigmegyünk a muveken, és berakjuk a peldanyokat
      for (const opus of results) {
        //A promise a results-ot adja vissza
        opus.specimen = await getOpus(res, opus.id);
      }
      sendingGet(res, null, results);
    });
    connection.release();
  });
});

//Opus és Specimen táblák inner join
app.get("/opusSpecimen", (req, res) => {
  let sql = `select * from opus o 
  inner join specimen s on s.opusid  = o.id`;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(sql, async function (error, results, fields) {
      if (error) {
        message = "Opus sql error";
        sendingGetError(res, message);
        return;
      }
      sendingGet(res, null, results);
    });
    connection.release();
  });
});

//Egy opus rekord
app.get("/opus/:id", (req, res) => {
  const id = req.params.id;
  let sql = `
    SELECT * FROM opus
    WHERE id = ?`;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(sql, [id], async function (error, results, fields) {
      if (error) {
        const message = "Opus sql error";
        sendingGetError(res, message);
        return;
      }
      if (results.length == 0) {
        const message = `Not found id: ${id}`;
        sendingGetError(res, message);
        return;
      }
      sendingGetById(res, null, results[0], id);
    });
    connection.release();
  });
});

//egy cars rekord a tripsjeivel
app.get("/opusWithSpecimen/:id", (req, res) => {
  const id = req.params.id;
  let sql = `
    SELECT * FROM specimen
    WHERE opusid = ?`;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(sql, [id], async function (error, results, fields) {
      if (error) {
        const message = "Opus sql error";
        sendingGetError(res, message);
        return;
      }
      if (results.length == 0) {
        const message = `Not found id: ${id}`;
        sendingGetError(res, message);
        return;
      }
      results[0].trips = await getOpus(res, id);
      sendingGetById(res, null, results[0], id);
    });
    connection.release();
  });
});

//egy cars rekord a tripsjeivel
app.get("/opusSpecimen/:id", (req, res) => {
  const id = req.params.id;
  let sql = `
  select * from opus o 
    inner join specimen s on s.opusid  = o.id
  where o.id = ?`;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(sql, [id], async function (error, results, fields) {
      if (error) {
        const message = "Opus sql error";
        sendingGetError(res, message);
        return;
      }
      if (results.length == 0) {
        const message = `Not found id: ${id}`;
        sendingGetError(res, message);
        return;
      }
      sendingGetById(res, null, results, id);
    });
    connection.release();
  });
});

app.get("/opusWithSpecimenNumber", (req, res) => {
  let sql = `select * from opus o 
  left join specimen s on s.opusid  = o.id`;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(sql, async function (error, results, fields) {
      if (error) {
        message = "Opus sql error";
        sendingGetError(res, message);
        return;
      }
      sendingGet(res, null, results);
    });
    connection.release();
  });
});

app.get("/carsWithDriversReal", (req, res) => {
  let sql = `select c.id, c.name, c.licenceNumber, c.hourlyRate, 
        if(c.outOfTraffic, 'true','false') outOfTraffic,
        c.driverId, d.driverName 
        from cars c
        inner join drivers d on d.id = c.driverId
        where c.outOfTraffic = 0
        `;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(sql, async function (error, results, fields) {
      if (error) {
        message = "Cars sql error";
        sendingGetError(res, message);
        return;
      }
      sendingGet(res, null, results);
    });
    connection.release();
  });
});

app.delete("/opus/:id", (req, res) => {
  const id = req.params.id;

  let sql = `
    DELETE FROM opus
    WHERE id = ?`;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(sql, [id], function (error, result, fields) {
      sendingDelete(res, error, result, id);
    });
    connection.release();
  });
});

app.post("/opus", (req, res) => {
  const newR = {
    writer: sanitizeHtml(req.body.writer),
    title: sanitizeHtml(req.body.title),
    year: req.body.year,
  };
  let sql = `
    INSERT opus 
    (writer, title, year)
    VALUES
    (?, ?, ?)
    `;
  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(
      sql,
      [newR.writer, newR.title, newR.year],
      function (error, result, fields) {
        sendingPost(res, error, result, newR);
      }
    );
    connection.release();
  });
});

app.put("/cars/:id", (req, res) => {
  const id = req.params.id;
  const newR = {
    writer: sanitizeHtml(req.body.writer),
    title: sanitizeHtml(req.body.title),
    year: req.body.year
  };
  let sql = `
    UPDATE cars SET
    writer = ?,
    title = ?,
    year = ?
    WHERE id = ?
      `;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(
      sql,
      [newR.writer, newR.title, newR.year, id],
      function (error, result, fields) {
        sendingPut(res, error, result, id, newR);
      }
    );
    connection.release();
  });
});

//OpusFirstOffset
app.get("/OpusFirstOffset", (req, res) => {
  let sql = `
  select * from opus
  order by title
  limit 40;`;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(sql, async function (error, results, fields) {
      if (error) {
        message = "Opus sql error";
        sendingGetError(res, message);
        return;
      }
      sendingGet(res, null, results);
    });
    connection.release();
  });
});

//OpusFirstOffset
app.get("/OpusSecondOffset", (req, res) => {
  let sql = `
  select * from opus 
    order by title
    limit 40
    offset 40`;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(sql, async function (error, results, fields) {
      if (error) {
        message = "Opus sql error";
        sendingGetError(res, message);
        return;
      }
      sendingGet(res, null, results);
    });
    connection.release();
  });
});
//#endregion cars

//#region specimen
app.get("/specimenOpusId", (req, res) => {
  let sql = `SELECT sId, opusid, price, DATE_FORMAT(acquisition, '%Y.%m.%d') FROM specimen
      ORDER BY opusid`;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(sql, async function (error, results, fields) {
      if (error) {
        message = "Opus sql error";
        sendingGetError(res, message);
        return;
      }
      sendingGet(res, null, results);
    });
    connection.release();
  });
});

app.get("/SpecimenOpusJoin", (req, res) => {
  let sql = `select o.id, o.writer, o.title, o.year, s.sId, s.opusid, s.price, DATE_FORMAT(s.acquisition, '%Y.%m.%d') acquisition from specimen s
  inner join opus o on o.id = s.sId
  group by o.title
  order by o.title`;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(sql, async function (error, results, fields) {
      if (error) {
        message = "Cars sql error";
        sendingGetError(res, message);
        return;
      }
      sendingGet(res, null, results);
    });
    connection.release();
  });
});



//#endregion drivers

//#region trips ---
app.get("/tripsByCarId/:id", (req, res) => {
  const id = req.params.id;
  let sql = `
    SELECT id, numberOfMinits, DATE_FORMAT(date, '%Y.%m.%d %h:%i:%s') date, carId from trips
    WHERE carId = ?
    ORDER BY date DESC
    `;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(sql, [id], function (error, results, fields) {
      sendingGetById(res, error, results, id);
    });
    connection.release();
  });
});

app.get("/trips/:id", (req, res) => {
  const id = req.params.id;
  let sql = `
    SELECT id, numberOfMinits, DATE_FORMAT(date, '%Y.%m.%d %h:%i:%s') date, carId from trips
    WHERE id = ?`;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(sql, [id], function (error, results, fields) {
      sendingGetById(res, error, results, id);
    });
    connection.release();
  });
});

app.get("/trips", (req, res) => {
  let sql = `
    SELECT id, numberOfMinits, DATE_FORMAT(date, '%Y.%m.%d %h:%i:%s') date, carId from trips`;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }

    connection.query(sql, function (error, results, fields) {
      sendingGet(res, error, results);
    });

    connection.release();
  });
});

app.post("/trips", (req, res) => {
  const newR = {
    numberOfMinits: sanitizeHtml(req.body.numberOfMinits),
    date: sanitizeHtml(req.body.date),
    carId: +sanitizeHtml(req.body.carId),
  };

  let sql = `
  INSERT trips 
  (numberOfMinits, date, carId)
  VALUES
  (?, ?, ?)
    `;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(
      sql,
      [newR.numberOfMinits, newR.date, newR.carId],
      function (error, result, fields) {
        sendingPost(res, error, result, newR);
      }
    );
    connection.release();
  });
});

app.delete("/trips/:id", (req, res) => {
  const id = req.params.id;

  let sql = `
    DELETE FROM trips
    WHERE id = ?`;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(sql, [id], function (error, result, fields) {
      sendingDelete(res, error, result, id);
    });
    connection.release();
  });
});



app.put("/trips/:id", (req, res) => {
  const id = req.params.id;
  const newR = {
    numberOfMinits: sanitizeHtml(req.body.numberOfMinits),
    date: sanitizeHtml(req.body.date),
    carId: +sanitizeHtml(req.body.carId),
  };
  let sql = `
    UPDATE trips SET
    numberOfMinits = ?,
    date = ?,
    carId = ?
    WHERE id = ?
      `;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(
      sql,
      [newR.numberOfMinits, newR.date, newR.carId, id],
      function (error, result, fields) {
        sendingPut(res, error, result, id, newR);
      }
    );
    connection.release();
  });
});
//#endregion trips

//#region loanings
app.get("/Loaning", (req, res) => {
  let sql = `SELECT * FROM loaning`;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(sql, async function (error, results, fields) {
      if (error) {
        message = "Opus sql error";
        sendingGetError(res, message);
        return;
      }
      sendingGet(res, null, results);
    });
    connection.release();
  });
});

app.get("/LoaningWithStudent", (req, res) => {
  let sql = `select * from loaning l
  inner join student st on st.id = l.studentid;`;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(sql, async function (error, results, fields) {
      if (error) {
        message = "Opus sql error";
        sendingGetError(res, message);
        return;
      }
      sendingGet(res, null, results);
    });
    connection.release();
  });
});

app.get("/Students", (req, res) => {
  let sql = `select * from student;`;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(sql, async function (error, results, fields) {
      if (error) {
        message = "Opus sql error";
        sendingGetError(res, message);
        return;
      }
      sendingGet(res, null, results);
    });
    connection.release();
  });
});

app.get("/Specimen", (req, res) => {
  let sql = `select sId, opusid, price,  DATE_FORMAT(acquisition, '%Y.%m.%d') acquisition from specimen;`;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(sql, async function (error, results, fields) {
      if (error) {
        message = "Opus sql error";
        sendingGetError(res, message);
        return;
      }
      sendingGet(res, null, results);
    });
    connection.release();
  });
});

app.get("/JoinEverything", (req, res) => {
  let sql = `
  select o.id, o.writer, o.title, o.year, s.sId, s.opusid, s.price, DATE_FORMAT(s.acquisition, '%Y.%m.%d') acquisition, l.id, l.specimentid, l.studentid, DATE_FORMAT(l.away, '%Y.%m.%d') away, DATE_FORMAT(l.back, '%Y.%m.%d') back, st.id, st.name, st.year from opus o
    inner join specimen s on s.opusid = o.id
    inner join loaning l on l.specimentid = s.sId
    inner join student st on st.id = l.studentid
    group by st.name;
  `;

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingGetError(res, "Server connecting error!");
      return;
    }
    connection.query(sql, async function (error, results, fields) {
      if (error) {
        message = "Opus sql error";
        sendingGetError(res, message);
        return;
      }
      sendingGet(res, null, results);
    });
    connection.release();
  });
});

function mySanitizeHtml(data) {
  return sanitizeHtml(data, {
    allowedTags: [],
    allowedAttributes: {},
  });
}

app.listen(process.env.APP_PORT, () => {
  console.log(
    `Data server, listen port: ${process.env.APP_PORT} (Auth: ${process.env.AUTH_ON == 1 ? "on" : "off"
    })`
  );
});

module.exports = { genSaltSync, hashSync, compareSync };


// l.id, l.specimentid, l.studentid, DATE_FORMAT(away, '%Y.%m.%d') l.away, DATE_FORMAT(back, '%Y.%m.%d') l.back,
//   o.id, o.writer, o.title, o.year,
//   s.sId, s.opusid, s.price, DATE_FORMAT(acquisition, '%Y.%m.%d') s.acquisition,
//   st.id, st.name, st.year