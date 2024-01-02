const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const UserModel = require('./models/user');
const authRoutes = require("./routes/authRoute");

const app = express();
const PORT = 3000;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1681997",
  database: "crudapi",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

passport.use(new LocalStrategy(
  { usernameField: 'username' },
  async (username, password, done) => {
    try {
      const [rows] = await connection.promise().query(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );

      const user = rows[0];

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      const isMatch = user.password === password; // Assuming plain text passwords

      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    } catch (error) {
      return done(error);
    }
  }
));

// Serialize user to session
passport.serializeUser(function(user, done) {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({ secret: "dbsdjksnssMnsJksnSSLSLSmskljsj", resave: true, saveUninitialized: true })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
