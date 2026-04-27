import express from "express";
import cors from "cors";
import userService from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);

if (!MONGO_CONNECTION_STRING) {
  console.error("Error: MONGO_CONNECTION_STRING is not defined in .env");
} else {
  const mongoURI = MONGO_CONNECTION_STRING.endsWith("/")
    ? `${MONGO_CONNECTION_STRING}users`
    : `${MONGO_CONNECTION_STRING}/users`;

  mongoose
    .connect(mongoURI) // connect to Db "users"
    .catch((error) => console.log(error));
}

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  userService
    .findUserById(id)
    .then((result) => {
      if (result === null) {
        res.status(404).send("Resource not found.");
      } else {
        res.send(result);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(404).send("Resource not found.");
    });
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  userService
    .getUsers(name, job)
    .then((result) => res.send({ users_list: result }))
    .catch((error) => {
      console.error(error);
      res.status(500).send("Server error.");
    });
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userService
    .addUser(userToAdd)
    .then((newUser) => res.status(201).send(newUser))
    .catch((error) => {
      console.error(error);
      res.status(400).send(error.message);
    });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  userService
    .removeUser(id)
    .then((deletedUser) => {
      if (deletedUser === null) {
        res.status(404).send("Resource not found.");
      } else {
        res.status(204).send();
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(404).send("Resource not found.");
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
