const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const server = require('http').Server(app)
// const io = require('socket.io')(server)
app.use(bodyParser.json())
app.set("view engine", 'ejs')
const port = process.env.PROT || 5000;

const table_init = require('./table_setup');
table_init.table_init();

// const meetingRouter = require('./routes/meeting')
// app.use("/meeting", meetingRouter)
const cors = require('cors')
app.use(cors({
  origin: "*"
}))
const accountRouter = require('./routes/account')
app.use("/account", accountRouter)
const authRouter = require('./routes/send_auth')
app.use("/auth", authRouter)
const blogRouter = require("./routes/blog")
app.use("/blog", blogRouter)
const exeRouter = require("./routes/exercise")
app.use("/exercise", exeRouter)
const recordRouter = require("./routes/recordings")
app.use("/record", recordRouter)
const calendarRouter = require("./routes/calendar")
app.use("/calendar", calendarRouter)
const popRouter = require('./routes/pop_up')
app.use("/", popRouter)



server.listen(port,  () => {
  console.log(`Server listening at http://localhost:${port}`);
});