const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const { host, user, password, database } = require("./dbconfig.js");
const knex = require("knex")({
  client: "pg",
  connection: {
    host,
    user,
    password,
    database
  }
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

const validatePresent = arr => {
  let isNotNull = true;
  arr.map(val => {
    if (val === null || val === "" || val === undefined) isNotNull = false;
  });
  return isNotNull;
};

app.get("/", (_req, res) => {
  res.json(db.users);
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  knex
    .select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then(([data]) => {
      const isValid = bcrypt.compareSync(password, data.hash);
      if (isValid) {
        return knex
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then(([user]) => {
            res.json(user);
          })
          .catch(err => res.status(400).json("Unable to get user"));
      } else {
        res.status(400).json("Wrong Credentials");
      }
    })
    .catch(err => res.status(400).json("Wrong Credentials"));
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password);

  if (validatePresent([name, email, password])) {
    knex.transaction(trx => {
      trx
        .insert({
          hash: hash,
          email: email
        })
        .into("login")
        .returning("email")
        .then(([loginEmail]) => {
          return trx("users")
            .returning("*")
            .insert({
              name: name,
              email: loginEmail,
              joined: new Date()
            })
            .then(user => {
              res.json(user[0]);
            })
            .then(trx.commit)
            .catch(trx.rollback);
        })
        .catch(err => res.status(400).json("Unable To Register"));
    });
  } else res.status(400).json("Unable To Register");
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;

  knex
    .select("*")
    .from("users")
    .where({ id })
    .then(([user]) => {
      if (user) res.json(user);
      else res.status(404).json("Not Found");
    })
    .catch(err => {
      res.status(400).json("");
    });
});

app.put("/image", (req, res) => {
  const { id } = req.body;

  knex("users")
    .where("id", "=", id)
    .increment({
      entries: 1
    })
    .returning("entries")
    .then(([entries]) => {
      res.json(entries);
    })
    .catch(err => res.status(400).json("Unable To Get Entries"));
});

app.listen(3000, () => {
  console.log("App is running on port 3000");
});
