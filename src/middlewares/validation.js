import { loginSchema, registerSchema } from "../utilts/validation.js"
import { ValidationError } from "../utilts/errors.js"


export default (req, res, next) =>{
  try {
    if(req.url == '/login'){
      let {error} = loginSchema.validate(req.body)
      if(error) throw error
    }

    if(req.url == '/register'){
      let {error} = registerSchema.validate({...req.body, ...req.files.name})
      if(error) throw error
    }


    return next()
  } catch (error) {
    return next(new ValidationError(401, error.message))
  }
}