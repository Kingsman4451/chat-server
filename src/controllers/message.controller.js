import { read, write } from '#model'
import { InternalServerError } from '#errors'
import moment from 'moment';
import '../../node_modules/moment/locale/uz-latn.js'
import path from 'path'
moment.locale('uz-latn')

const GET = (req, res, next) => {
  try {
    let messages = read('messages')
    let users = read('users')
    let { userId } = req.query
    messages.map(message => {
      message.user = users.find(user => {
        delete user.password
        return user.userId == message.userId
      })
    })
    if(userId){
      let message = messages.filter(message => message.userId == userId)
      if (!message.length) {
        return res.status(401).send({
          statusCode: 401,
          message: 'No messages found'
        })
      }
      res.send(message)
    }
    res.send(messages)
  } catch (error) {
    return next(new InternalServerError(500, error.message))
  }
}


const POST = (req, res, next) => {
  try {
    let { body } = req.body
    let messages = read('messages')
    let users = read('users')
    let dataName = ''
    if(typeof body !== 'string') {
      dataName = new Date().getTime() + req.files.body.name.replace(/\s/g, '') 
      req.files.body.mv(path.join(process.cwd(), "src", 'uploads', 'data', dataName))
    }
    console.log(body);
    let newMessage = {
      messageId: messages.length ? messages.at(-1).messageId + 1 : 1,
      userId: req.userId,
      body: dataName ? `/data/${dataName}`: body,
      createdAt: moment().format('LT')
    }
    messages.push(newMessage)
    write('messages', messages)
    return res.status(201).json({
      status: 201,
      message: 'success',
      data: newMessage
    })
  } catch (error) {
    return next(new InternalServerError(500, error.message))
  }
}


export default {
  GET,
  POST
}