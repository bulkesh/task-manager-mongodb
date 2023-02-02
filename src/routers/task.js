const express = require('express');
const Task = require('../models/Task');

const router = new express.Router();
router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    try {
        const tasks = await task.save();
        res.status(201).send(tasks);
    } catch (err) {
        res.status(400).send(err.message);
    }

})
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.status(200).send(tasks);
    } catch (err) {
        res.status(404).send(err.message);
    }
})
router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findById(_id);
        if (!task) {
            res.status(404).send('Task not found');
        } else {
            res.send(task);
        }
    }
    catch (err) {
        res.status(404).send(err.message);
    }

})
router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValid = updates.every((update) => allowedUpdates.includes(update));
    if (!isValid) { 
        return res.status(400).send({error:"Some fields are not allowed"}) 
    };

    try {
        const task = await Task.findById(req.params.id);
        updates.forEach((key) => task[key] = req.body[key]);
        await task.save();
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true });
       
        if (!task) { res.status(404).send('Task not found') }
        else { res.send(task) }
    } catch (e) {
        res.status(400).send(e);
    }
})
router.delete('/tasks/:id', async (req, res) => {
    try {
       const task = await Task.findByIdAndDelete(req.params.id);
       if (!task) {
           res.status(404).send('Task not found');
       } else {
           res.send(task);
       }
   }
   catch (err) {
       res.status(404).send(err.message);
   }
})

module.exports = router;