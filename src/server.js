import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import fileUpload from 'express-fileupload';
import fs from 'fs';
import path from 'path';
import  userRouter from './routes/user.router.js'
import  messageRouter from './routes/message.router.js'
const PORT = process.env.PORT || 5000;




const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors :{
    origin : "https://chat-app-blond-two.vercel.app"
  }
});

io.on("connection", (socket) => {
  socket.on('new user',(data)=>{
    io.emit("new user", data)
  })

  socket.on('new message',(data)=>{
    io.emit("new message", data)
  })

});




app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Token, Authorization");
  next();
});
app.use(express.json())
app.use(fileUpload())
app.use(express.static(path.join(process.cwd(), 'src', 'uploads')))


app.use(userRouter)
app.use(messageRouter)


app.use((error, req, res, next) => {
  if(error.status != 500){
    return res.status(error.status).json({
      status: error.status,
      message: error.message
    })
  }

  fs.appendFileSync(path.resolve(process.cwd(), 'log.txt'),
  `${req.url}--------${req.method}---------${new Date()}---------${error.message}\n`
  )

  res.status(error.status).json({
    status: error.status,
    message: error.name
  })
  process.exit()
})
httpServer.listen(PORT, ()=> console.log("server ready http://localhost:" + PORT ))