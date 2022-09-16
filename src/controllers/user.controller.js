import { read, write } from '#model'
import { AuthorizationError, InternalServerError } from '#errors'
import jwt from '../utilts/jwt.js'
import path from 'path'
import sha256 from 'sha256'

const LOGIN = (req, res, next) => {
  try {
    let users = read('users')
    let{ username, password } = req.body
    let user = users.find(user => user.username == username && user.password == sha256(password));

    if(!user){
      return next(new AuthorizationError(401, 'Invalid username or password'));
    }

    return res.status(200).json({
      status: 200,
      message: 'ok',
      token: jwt.sign({userId: user.userId})
    })
  } catch (error) {
    return next(new InternalServerError(500, error.message))
  }
}


const REGISTER = (req, res, next) => {
  try {
    let users = read('users')
    let { username, password, contact } = req.body
    let avatarName = ''
    if(req.files.avatar){
      avatarName = new Date().getTime() + req.files.avatar.name.replace(/\s/g, '') 
      req.files.avatar.mv(path.join(process.cwd(), "src", 'uploads', 'avatars', avatarName))
    }
    let newUser  = {
      userId: users.length ? users.at(-1).userId + 1 : 1,
      username, password: sha256(password), contact, avatar: avatarName ? `/avatars/${avatarName}` : false
    }

    users.push(newUser);
    write('users', users)
    delete newUser.password
    return res.status(201).json({
      status: 201,
      message: 'success',
      token: jwt.sign({userId: newUser.userId}),
      data: newUser
    })
  } catch (error) {
    return next(new InternalServerError(500, error.message))
  }
}

const GET = (req, res, next) => {
  try {
    let users= read('users').filter(user => delete user.password )
    let { userId } = req.query
    if(userId){
      return res.status(200).send(
        users.find(user => user.userId == userId)
      )
    }
    res.send(users)
  } catch (error) {
    return next(new InternalServerError(500, error.message))
  }
}

const GETUSER = (req, res, next) => {
  try {
    let users= read('users')
    
    if(req.userId){
      return res.status(200).send(
        {userId: req.userId}
      )
    }
    res.send(users)
  } catch (error) {
    return next(new InternalServerError(500, error.message))
  }
}

export default {
  LOGIN,
  REGISTER,
  GET,
  GETUSER
}