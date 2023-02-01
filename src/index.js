const express = require('express');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        const users = await user.save();
        res.status(201).send(users);
    } catch (err) {
        res.status(400).send(err.message);
    }
})
app.get('/users', async (req, res) => {
    try {
        const user = await User.find({});
        res.status(200).send(user);
    } catch (e) {
        res.status(404).send(e.message);
    }
})
app.get('/users/:id', async (req, res) => {
    const _id = ObjectId(req.params.id);
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
app.patch('/users/:id', async (req, res) => {
    const allowedUpdates = ['name', 'email', 'age', 'password'];
    const updateKeys = Object.keys(req.body);
    const isValidUpdate = updateKeys.every((updates) => allowedUpdates.includes(updates))
    if (!isValidUpdate) {
        return res.status(400).send("Some fields are not allowed");
    }
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true });
        if (!user) { res.status(404).send('User not found') }
        else { res.send(user) };
    } catch (e) {
        res.status(400).send(e)
    }
})
app.delete('/users/:id', async (req, res) => {
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

app.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    try {
        const tasks = await task.save();
        res.status(201).send(tasks);
    } catch (err) {
        res.status(400).send(err.message);
    }

})
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.status(200).send(tasks);
    } catch (err) {
        res.status(404).send(err.message);
    }
})
app.get('/tasks/:id', async (req, res) => {
    const _id = ObjectId(req.params.id);
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
app.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValid = updates.every((update) => allowedUpdates.includes(update));
    if (!isValid) { 
        return res.status(400).send({error:"Some fields are not allowed"}) 
    };

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true });
        console.log(task);
        if (!task) { res.status(404).send('Task not found') }
        else { res.send(task) }
    } catch (e) {
        res.status(400).send(e);
    }
})
app.delete('/tasks/:id', async (req, res) => {
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

/* const deleteTaskAndCount = async(id) => {
    const deleteTask = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({completed:false});
    return count;
}

deleteTaskAndCount('63d788a51bf9c798a548adf3')
.then((count) => {
    console.log("count : ",count);
})
.catch((err) => {
    console.log("err : ",err);
}) */

app.listen(port, () => {
    console.log("App is listening on port " + port);
});