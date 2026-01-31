const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const filePath = path.join(__dirname, "users.json");

// Helpers

function readUsers() {
  if (!fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath, "utf8") || "{}");
}

function writeUsers(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// APIs

// Add User ==> POST /user
 
app.post("/user", (req, res) => {
  const { name, age, email } = req.body;
  const users = readUsers();

  for (let id in users) {
    if (users[id].email === email) {
      return res.json({ message: "Email already exists." });
    }
  }

  const id = Date.now().toString();
  users[id] = { id, name, age, email };
  writeUsers(users);

  res.json({ message: "User added successfully." });
});

// Update User ==> PATCH /user/:id
app.patch("/user/:id", (req, res) => {
  const users = readUsers();
  const { id } = req.params;

  if (!users[id]) {
    return res.json({ message: "User ID not found." });
  }

  users[id] = { ...users[id], ...req.body };
  writeUsers(users);

  res.json({ message: "User updated successfully." });
});

// Delete User ==> DELETE /user/:id
app.delete("/user/:id?", (req, res) => {
  const users = readUsers();
  const id = req.params.id || req.body.id;

  if (!users[id]) {
    return res.json({ message: "User ID not found." });
  }

  delete users[id];
  writeUsers(users);

  res.json({ message: "User deleted successfully." });
});

// Get User by Name ==> GET /user/getByName?name=ali

app.get("/user/getByName", (req, res) => {
  const { name } = req.query;
  const users = readUsers();

  for (let id in users) {
    if (users[id].name === name) {
      return res.json(users[id]);
    }
  }

  res.json({ message: "User name not found." });
});

// Get All Users ==> GET /user
app.get("/user", (req, res) => {
  const users = readUsers();
  res.json(Object.values(users));
});

// Filter Users by Minimum Age ==> GET /user/filter?minAge=25
app.get("/user/filter", (req, res) => {
  const { minAge } = req.query;
  const users = readUsers();

  const result = Object.values(users).filter(
    (user) => user.age >= Number(minAge)
  );

  if (result.length === 0) {
    return res.json({ message: "No user found." });
  }

  res.json(result);
});

// Get User by ID==> GET /user/:id
app.get("/user/:id", (req, res) => {
  const users = readUsers();
  const { id } = req.params;

  if (!users[id]) {
    return res.json({ message: "User ID not found." });
  }

  res.json(users[id]);
});

//Server

app.listen(3000, () => {
  console.log("Server running on port 3000");
});