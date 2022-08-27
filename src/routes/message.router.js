import { Router } from "express";
import messageController from "../controllers/message.controller.js"
import checktoken from "../middlewares/checktoken.js";



const router = Router()

router.get('/messages', checktoken, messageController.GET)
router.get('/messages/:userId',checktoken, messageController.GET)
router.post('/messages',checktoken, messageController.POST)


export default router