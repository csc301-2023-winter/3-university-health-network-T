const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const server = require('http').Server(app)
// const io = require('socket.io')(server)
app.use(bodyParser.json())
app.set("view engine", 'ejs')
const port = process.env.PORT || 4000;

const table_init = require('./table_setup');
table_init.table_init();

const cors = require('cors');
app.use(express.static('client'))
app.use(cors({
  origin: "*"
}))
const meetingRouter = require('./routes/meeting')
app.use("/meeting", meetingRouter)
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
const helpRouter = require('./routes/help')
app.use("/help", helpRouter)
const contactRouter = require('./routes/contact')
app.use("/contact", contactRouter)

app.use(function(req, res) {
  res.sendFile(path.resolve(__dirname, './client/index.html'))
})

server.listen(port,  () => {
  console.log(`Server listening at http://localhost:${port}`);
});