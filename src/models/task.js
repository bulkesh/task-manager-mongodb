const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description:{
        type: String,
        required: true,
        trim: true,
        minLength:10
    },
    completed: {
        type: Boolean,
        default: false
    }
});
taskSchema.pre('save', async function(next){
    const task = this;
    console.log("Before saving task: " ,task);
    next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
