import express from 'express';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import path from 'path';
import  userRouter from './routes/user.router.js'
import  messageRouter from './routes/message.router.js'

const PORT = process.env.PORT || 5000;

let app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Token");
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
app.listen(PORT, ()=> console.log("server ready http://localhost:" + PORT ))