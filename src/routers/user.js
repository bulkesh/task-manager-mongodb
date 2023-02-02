const express = require('express');
const User = require('../models/user');

const router = new express.Router();

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        const users = await user.save();
        res.status(201).send(users);
    } catch (err) {
        res.status(400).send(err.message);
    }
})
router.get('/users', async (req, res) => {
    try {
        const user = await User.find({});
        res.status(200).send(user);
    } catch (e) {
        res.status(404).send(e.message);
    }
})
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;
    console.log(req.params);
    try {
        const user = await User.findById(_id);
        if (!user) {
            res.status(404).send('User not found');
        } else {
            res.send(user);
        }
    }
    catch (err) {
        res.status(404).send(err.message);
    }
})
router.patch('/users/:id', async (req, res) => {
    const allowedUpdates = ['name', 'email', 'age', 'password'];
    const updateKeys = Object.keys(req.body);
    const isValidUpdate = updateKeys.every((updates) => allowedUpdates.includes(updates))
    if (!isValidUpdate) {
        return res.status(400).send("Some fields are not allowed");
    }
    try {
        const user = await User.findById(req.params.id);

        updateKeys.forEach(element => user[element] = req.body[element]);

        await user.save();
        
        if (!user) { res.status(404).send('User not found') }
        else { res.send(user) };
    } catch (e) {
        res.status(400).send(e)
    }
})
router.delete('/users/:id', async (req, res) => {
     try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).send('User not found');
        } else {
            res.send(user);
        }
    }
    catch (err) {
        res.status(404).send(err.message);
    }
})
router.post('/users/login', async (req, res) => {
   
    try {
        const user = await User.findByCredientials(req.body.email.trim(), req.body.password.trim());
        console.log("login success");
        res.send(user);
    }catch(e){
        res.status(400).send({Error:e.message});
    }
});
module.exports = router;