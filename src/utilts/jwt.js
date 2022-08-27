import JWT from "jsonwebtoken"
const secretKey = "mahfiy"

export default {
  sign: (payload)=>JWT.sign(payload, secretKey),
  verify: (token)=>JWT.verify(token, secretKey),
}