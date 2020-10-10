const express = require('express');
const User = require('../models/User');
const Coffee = require('../models/Coffee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');
const authMiddleware = require('../middlewares/auth');
const bodyParser = require('body-parser');

const router = express.Router();

// router.use(authMiddleware);

// Início - função auxiliar para listar o resultado do /report
async function listOrders(intensity) {
    const coffees = await Coffee.find({intensity: String(intensity)})
        .select({ user: 1 , _id: 0});
    
    var auxCoffees = [];
    coffees.forEach(async element => {
        await auxCoffees.push(String(element.user));
    }); 
        
    //Listar usuários _id name
    const users = await User.find()
        .select({ name: 'name' });
    //
    
    var cont = [];
    for (let i = 0; i < users.length; i++) {
        cont[i] = 0;
        auxCoffees.forEach(element => {
            if(element == String(users[i]._id)){
                cont[i] = cont[i] + 1;
            } 
        });   
    }
    
    var userOrders = [];
    for (let i = 0; i < users.length; i++) {
        userOrders.push({name: users[i].name, quantity: cont[i]});
    }
    
    return userOrders;
}
// Fim listOrders()

// Início Order
router.post('/order', authMiddleware, async (req, res) => {
    const { intensity } = req.body;

    try {
        if(intensity != 'forte' && intensity != 'médio' && intensity != 'fraco'){
            return res.status(422).send({error: 'Intensidade do café inválida'});
        }

        const coffee = await Coffee.create({ ...req.body, user: req.userId});

        res.status(201).send({ 
            message: 'Dados armazenados com sucesso',
            userId: req.userId,
            coffee: coffee,
        });

    }catch (err) {
        return res.status(400).send({ error: 'Error ao criar ordem'})
    }
});
// Fim Order

// Início Report
router.get('/report', async (req, res) => {
    try {
        //organizando o JSON do result
        var userOrders = {};
        var resultCoffees = [];

        userOrders = await listOrders("forte");
        resultCoffees.push({intensity: "forte", userOrders});

        userOrders = await listOrders("médio");
        resultCoffees.push({intensity: "médio", userOrders});

        userOrders = await listOrders("fraco");
        resultCoffees.push({intensity: "fraco", userOrders});
        //

        res.status(201).send({
            resultCoffees
        });

    }catch (err) {
        return res.status(400).send({ error: 'Erro ao criar ordem'})
    }
});
// Fim Report

module.exports = app => app.use('/coffee', router);