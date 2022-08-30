import Joi from "joi";

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
})


export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(8).required(),
  repeat_password: Joi.ref("password"),
  contact: Joi.string().pattern(new RegExp(/^998[389][0123456789][0-9]{7}$/)),
  avatar: Joi.string().pattern(new RegExp(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i))
})