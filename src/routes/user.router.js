import { Router } from "express";
import userController from "../controllers/user.controller.js"
import validation from "../middlewares/validation.js";
import checktoken from "../middlewares/checktoken.js";



const router = Router()

router.post('/login', validation, userController.LOGIN)
router.post('/register', validation, userController.REGISTER)
router.get('/users', checktoken, userController.GET)
router.get('/users/:userId', checktoken, userController.GET)

export default router