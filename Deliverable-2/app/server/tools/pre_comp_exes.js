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
                    Exercise: prescribedExercise.exercise,
                    // Characters: [prescribedExercise.Character],
                    Day_Of_Week: prescribedExercise.day_of_week - completedCounter,
                    Number_Sets: prescribedExercise.number_sets,
                    Number_Repetitions: prescribedExercise.number_repetitions,
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
            const startOfDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
            const endOfDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (6 - currentDate.getDay()));
        
            const query = `SELECT Exercise, Number_Sets, Number_Repetitions, Date, COUNT(*) AS Counter
                            FROM CompletedExercise
                            WHERE PatientID = $3
                            GROUP BY Exercise, Number_Sets, Number_Repetitions`;
            pool.query(query, [startOfWeek, endOfWeek, patientId], (err, result) => {
                if (err) {
                console.error(err);
                return reject([]);
                }
                return resolve(result.rows);
            });
        });
    }
}
