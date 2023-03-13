const { pool } = require('../dbConfig');

module.exports = {
    exe_todo: function (patientId) {
        return new Promise((resolve, reject) => {
          const currentDate = new Date();
          const startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
          const endOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (6 - currentDate.getDay()));
      
          const query = `SELECT Exercise, Number_Sets, Number_Repetitions, COUNT(*) AS Counter
                          FROM CompletedExercise
                          WHERE Date BETWEEN $1 AND $2 AND PatientID = $3
                          GROUP BY Exercise, Number_Sets, Number_Repetitions`;
          pool.query(query, [startOfWeek, endOfWeek, patientId], (err, result) => {
            if (err) {
              console.error(err);
              return reject(err);
            }
            const completedExercises = result.rows;
      
            const prescribedExerciseQuery = `SELECT Exercise, Number_Sets, Number_Repetitions, Day_Of_Week
                                              FROM PrescribedExercise
                                              WHERE PatientID = $1`;
            pool.query(prescribedExerciseQuery, [patientId], (err, presult) => {
              if (err) {
                console.error(err);
                return reject(err);
              }
              const prescribedExercises = presult.rows;
      
              const shouldDoExercises = [];
              for (const prescribedExercise of prescribedExercises) {
                let completedCounter = 0;
                for (const completedExercise of completedExercises) {
                  if (prescribedExercise.exercise === completedExercise.exercise &&
                      prescribedExercise.number_Sets === completedExercise.number_sets &&
                      prescribedExercise.number_Repetitions === completedExercise.number_repetitions) {
                    completedCounter = completedExercise.Counter;
                    break;
                  }
                }
                if (completedCounter < prescribedExercise.day_of_week) {
                  shouldDoExercises.push({
                    exercise: prescribedExercise.exercise,
                    characters: [],
                    day_of_week: prescribedExercise.day_of_week - completedCounter,
                    number_sets: prescribedExercise.number_sets,
                    number_repetitions: prescribedExercise.number_repetitions,
                  });
                }
              }
              return resolve(shouldDoExercises);
            });
          });
        });
    },
    get_all_compe: function (patientId) {
        return new Promise((resolve, reject) => {
            const currentDate = new Date();
            const startOfDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 10, 1);
            const endOfDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 3, 0);
        
            const query = `SELECT Exercise, Number_Sets, Number_Repetitions, Date
                            FROM CompletedExercise
                            WHERE Date BETWEEN $1 AND $2 AND PatientID = $3`;
            pool.query(query, [startOfDate, endOfDate, patientId], (err, result) => {
                if (err) {
                console.error(err);
                return reject(err);
                }
                const completedExercises = result.rows;

                const exercisesByDate = {};
                for (const completedExercise of completedExercises) {
                    const date = completedExercise.date.toLocaleDateString();
                    if (!exercisesByDate[date]) {
                        exercisesByDate[date] = [];
                    }
                    exercisesByDate[date].push({
                        exercise: completedExercise.exercise,
                        number_sets: completedExercise.number_sets,
                        number_repetitions: completedExercise.number_repetitions
                    });
                }
                return resolve(exercisesByDate);
            });
        });
    },
    getAllMeetings: function (patientId) {
        return new Promise((resolve, reject) => {
        const currentDate = new Date();
        const startOfDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 10, 1);
        const endOfDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 3, 0);
        const query = `SELECT Date, StartTime, EndTime, MeetingID
                        FROM Meeting
                        WHERE Date BETWEEN $1 AND $2 AND PatientID = $3`;
        pool.query(query, [startOfDate, endOfDate, patientId], (err, result) => {
            if (err) {
            console.error(err);
            return reject(err);
            }
            const meetings = result.rows;
            const meetingsByDate = {};
            for (const meeting of meetings) {
            if (!meetingsByDate[meeting.date]) {
                meetingsByDate[meeting.date] = [];
            }
            meetingsByDate[meeting.date].push({
                starttime: meeting.starttime,
                endtime: meeting.endtime,
                meetingid: meeting.meetingid
            });
            }
            return resolve(meetingsByDate);
        });
        });
    }      
}
