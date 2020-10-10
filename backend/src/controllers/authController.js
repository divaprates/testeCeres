const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

const router = express.Router();

// Início Sign Up
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if(await (!name || !email || !password)){
            return res.status(422).send({ error: 'dados incorretos'});
        }

        if(await User.findOne({ email })){
            return res.status(409).send({ error: 'email já cadastrado'});
        }

        const user = await User.create(req.body);
        user.password = undefined;
        return res.status(201).send({ user });
    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' });
    }
});
// Fim Sign Up

// Início Sign In
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        if(await (!email || !password)){
            return res.status(422).send({ error: 'dados incorretos'});
        }
        
        const user = await User.findOne({ email }).select('+password');
        if(!user){
            return res.status(401).send({ error: 'usuário não encontrado'});
        }

        if(!await bcrypt.compare(password, user.password)){
            return res.status(401).send({ error: 'falha na autenticação'});
        }  

        user.password = undefined;
        const token = jwt.sign({
            id: user.id,
        }, authConfig.secret, {
            expiresIn: 86400  
        });

        return res.status(200).send({ 
            message: 'Autenticado com sucesso',
            token: token,
        });
    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' });
    }
});
// Fim Sign In

module.exports = app => app.use('/auth', router);