// models/userModel.js
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1681997",
  database: "crudapi",
});

const userSchema = {
  username: { type: "VARCHAR(255)", allowNull: false, unique: true },
  password: { type: "VARCHAR(255)", allowNull: false },
  role: { type: "ENUM('user', 'admin')", defaultValue: "user" },
};

// You might need to create the 'users' table here using connection.query()

module.exports = { connection, userSchema };
