import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const todoSchema = new Schema({
    todo: { type: String, required: true },
    isDone: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
});

export default mongoose.model('todo', todoSchema);