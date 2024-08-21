import { MessageModel } from "../../database/models/message.model.js"
import { UserModel } from "../../database/models/user.model.js"


export const index = async (req, res, next) => {
    try {
        res.render("index.ejs", {
            isLoggedIn: false
        })
    } catch (error) {
        next(error)
    }
}

export const login = async (req, res, next) => {
    try {
        res.render("login.ejs", {
            error: req.query.error,
            isLoggedIn: false
        })
    } catch (error) {
        next(error)
    }
}

export const register = async (req, res, next) => {
    try {
        res.render("register.ejs", {
            error: req.query.error,
            isLoggedIn: false
        })
    } catch (error) {
        next(error)
    }
}

export const messages = async (req, res, next) => {
    try {
        const messages = await MessageModel.find({userId:req.session.userId})
        const session = req.session
        const url = `${req.protocol}://${req.headers.host}/user/${session.userId}`
        if (session.isLoggedIn) {
            res.render("messages.ejs", {
                isLoggedIn: session.isLoggedIn,
                name: session.name,
                messages,
                url
            })
        } else {
            res.redirect("/login")
        }
    } catch (error) {
        next(error)
    }
}

export const user =  (req, res, next) => {
    try {
        const session = req.session
        if (session.isLoggedIn) {
            res.render("user.ejs", {
                isLoggedIn: session.isLoggedIn,
                name: session.name,
                userId: session.userId
            })
        } else {
            res.redirect("/login")
        }
    } catch (error) {
        next(error)
    }
}

export const handelRegister = async (req, res, next) => {
    try {
        const { name, email, password, PasswordConfirmation } = req.body

        if (password !== PasswordConfirmation) {
            return res.redirect("/register?error=Password does not match password confirmation")
        }
        const user = await UserModel.findOne({ email })
        if (user) {
            return res.redirect("/register?error=email already exist")
        }
        const newUser = new UserModel({ name, email, password })
        await newUser.save()
        res.redirect("/login")
    } catch (error) {
        next(error)
    }
}

export const handelLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await UserModel.findOne({ email })
        if (!user || user.password !== password) {
            return res.redirect("/login?error=Wrong Email or Password")
        }
        req.session.userId = user._id;
        req.session.name = user.name;
        req.session.isLoggedIn = true;
        res.redirect("/messages")
    } catch (error) {
        next(error)
    }
}

export const logout =  (req, res, next) => {
    try {
        req.session.destroy(function (err) {

            res.redirect("/login")
        })
    } catch (error) {
        next(error)
    }
}

export const sendMsg = async (req, res, next) => {
    try {
        console.log(req.body);
        console.log(req.params);
        await MessageModel.create({
            userId:req.params.id,
            content:req.body.msg
        })
        res.redirect("/user/"+req.params.id)
    } catch (error) {
        next(error)
    }
}