const express = require('express')
const cors = require('cors');
const http =require('http')
const {Server}=require('socket.io')
const app = express()
const server = http.createServer(app);
// const io = socketIo(server);


app.use(express.json());
app.use(cors());


require("dotenv").config();

const db= require("./models/db");


const port = 3001;

const userRouter =require("./routes/user")
app.use("/user" , userRouter)

const postRouter=require("./routes/post")
app.use("/post", postRouter) 


const loginRouter=require("./routes/login")
app.use("/login",loginRouter)

const commentRouter=require("./routes/comment")
app.use("/comment",commentRouter)

const likeRouter=require("./routes/like")
app.use("/like",likeRouter)

const friendRouter =require("./routes/friends")
app.use("/friend" , friendRouter)
 
const searchRouter=require("./routes/search")
app.use("/search", searchRouter)

const messageRouter=require("./routes/message")
app.use("/message",messageRouter)




const io = new Server (server , {cors : {
  origin: "http://localhost:3000",
  methods : ["GET" , "POST"],

}})


io.on('connection', (socket) => {
  console.log('A client connected');

  socket.on('messageFromFrontend', (data) => {
    console.log('Received message from frontend:', data);
    io.emit('messageToFrontend', data); // Emitting the message to all clients
  });

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});


const notificationRouter =require("./routes/notification")
app.use("/not", notificationRouter)

app.get('/', (req, res) => {
  res.send('Hello World!')
})




server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})