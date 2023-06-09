const express = require('express')
const usersRouter = express.Router()

const { UserModel } = require('../models/user')

const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')


//!signin
usersRouter.post('/signin', async (req, res, next) => {
    try {
        const {name, password} = req.body
        const user = await UserModel.findOne({name: name})

        if(user) {
            res.json({error: 'Este usuario ya existe'})
        } else {
            //user does not exist (good)
            const hashedPassword = await bcryptjs.hash(password, 10)
            const newUser = new UserModel({
                name,
                password: hashedPassword
            })

            //save user
            const savedUser = await newUser.save()

            //response.json
            const payload = {
                name: savedUser.name,
                userId: savedUser._id,
                expiration: new Date
            }
            const token = jwt.sign(payload, process.env.SECRET)
            res.json({token, name: savedUser.name})
        }
    } catch (err) {
        console.log('signin', err.name)
        next(err)
    }
})


//!login by token
usersRouter.post('/login', async (req, res, next) => {
    try {
        if(req.headers.authorization){
            const token = req.headers.authorization.split(" ").pop()
            const payload = jwt.verify(token, process.env.SECRET)
            const timeDifference = (new Date - new Date(payload.expiration)) / 60000 //this returns the token lifetime in minutes
        
            if(timeDifference < 120) {
                const user = await UserModel.findById(payload.userId)

                res.json({token, name: user.name})
            } else {
                res.json({error: 'token expired'})
            }

        } else {
            next()
        }
        
    } catch (err) {
        console.log('login by token:',err)
        next(err)
    }
})

//!login by name and password
usersRouter.post('/login', async (req, res, next) => {
    try{
        const { name, password } = req.body
        const user = await UserModel.findOne({name: name})
        
        const ispasswordOk = user 
            ? await bcryptjs.compare(`${password}`, user.password)
            : false 
        //
        if(ispasswordOk){
            const payload = {
                name: user.name,
                userId: user._id,
                expiration: new Date
            }

            const token = jwt.sign(payload, process.env.SECRET)
            res.json({ token, name: user.name })

        } else {
            res.json({error: 'Usuario o Contraseña no correcta'})
        }
    } catch (err) {
        console.log('login by password:',err.name)  
        next(err)
    }
})

module.exports = usersRouter
