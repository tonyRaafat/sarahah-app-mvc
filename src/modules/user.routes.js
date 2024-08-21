import express from 'express';
import { handelLogin, handelRegister, index, login, logout, messages, register, sendMsg, user } from './user.controllers.js';

const router = express.Router({caseSensitive:true});

router.get("/login",login);
router.get("/logout",logout);
router.get("/register",register);
router.get("/",index);
router.get("/user/:id",user);
router.get("/messages",messages);
router.post("/sendMsg/:id",sendMsg);
router.post("/handleRegister",handelRegister);
router.post("/handleLogin",handelLogin);



export default router;