//============================================================
require('dotenv').config();

const pg = require('pg');

const pool = new pg.Pool({
    host: `${process.env.DB_HOST}`,
    user: `${process.env.DB_USER}`,     
    password: `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB_NAME}`,
    port: `${process.env.DB_PORT}}`,
    ssl: true
});
//============================================================


// patient
pool.query(`
CREATE TABLE IF NOT EXISTS Patient (
  PatientID serial PRIMARY KEY,
  Email varchar(255) NOT NULL,
  Password varchar(255) NOT NULL,
  UNIQUE (Email)
);
`, (err, res) => {
  if (!err) {
    console.log("Table 'Patient' created successfully.");
  } else {
    console.log("Error creating table:", err);
  }
});

// avatar
pool.query(`
CREATE TABLE IF NOT EXISTS Avatar (
  Exercise varchar(255) NOT NULL,
  Character varchar(255) NOT NULL,
  Format varchar(255) NOT NULL,
  Path varchar(255) NOT NULL,
  PRIMARY KEY (Exercise, Character),
  UNIQUE (Path)
);
`, (err, res) => {
  if (!err) {
    console.log("Table 'Avatar' created successfully.");
  } else {
    console.log("Error creating table 'Avatar':", err);
  }
});

// PrescribedExercis
pool.query(`
CREATE TABLE IF NOT EXISTS PrescribedExercise (
  PatientID integer REFERENCES Patient(PatientID),
  Exercise varchar(255) NOT NULL,
  Number_Sets integer NOT NULL,
  Number_Repetitions integer NOT NULL,
  Day_Of_Week integer NOT NULL,
  PRIMARY KEY (PatientID, Exercise, Day_Of_Week)
);
`, (err, res) => {
  if (!err) {
    console.log("Table 'PrescribedExercise' created successfully.");
  } else {
    console.log("Error creating table:", err);
  }
});

// CompletedExercise
pool.query(`
CREATE TABLE IF NOT EXISTS CompletedExercise (
  PatientID integer REFERENCES Patient(PatientID),
  Exercise varchar(255) NOT NULL,
  Number_Sets integer NOT NULL,
  Number_Repetitions integer NOT NULL,
  Date date NOT NULL,
  Time timestamp NOT NULL,
  PRIMARY KEY (PatientID, Exercise, Date, Time)
);
`, (err, res) => {
  if (!err) {
    console.log("Table 'CompletedExercise' created successfully.");
  } else {
    console.log("Error creating table:", err);
  }
});

pool.query(`
CREATE TABLE IF NOT EXISTS RecordedVideo (
  PatientID integer REFERENCES Patient(PatientID),
  VideoID serial PRIMARY KEY,
  Date date NOT NULL,
  Time timestamp NOT NULL,
  Format varchar(5) NOT NULL,
  Path varchar(255) NOT NULL,
  UNIQUE (Path)
);
`, (err, res) => {
  if (!err) {
    console.log("Table 'RecordedVideo' created successfully.");
  } else {
    console.log("Error creating table:", err);
  }
});

pool.query(`
CREATE TABLE IF NOT EXISTS RecordedBodyJoints (
  BodyJointsID serial PRIMARY KEY,
  PatientID integer REFERENCES Patient(PatientID),
  Date date NOT NULL,
  Time timestamp NOT NULL,
  Format varchar(10) NOT NULL,
  Path varchar(255) NOT NULL,
  UNIQUE (Path)
);
`, (err, res) => {
  if (!err) {
    console.log("Table 'RecordedBodyJoints' created successfully.");
  } else {
    console.log("Error creating table:", err);
  }
});

pool.query(`
CREATE TABLE IF NOT EXISTS Meeting (
  PatientID integer REFERENCES Patient(PatientID),
  Date date NOT NULL,
  Time time NOT NULL,
  MeetingID serial PRIMARY KEY,
  MeetingPasscode varchar(255) NOT NULL
);
`, (err, res) => {
  if (!err) {
    console.log("Table 'Meeting' created successfully.");
  } else {
    console.log("Error creating table:", err);
  }
});
// ======================================================


module.exports = {pool};
