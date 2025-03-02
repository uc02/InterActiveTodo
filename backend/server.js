const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const { MongoServerClosedError } = require('mongodb');
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const TodoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

const Todo = mongoose.model("Todo", TodoSchema);

app.get('/todos', async(req,res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post("/todos", async(req, res) => {
  const newTodo = new Todo({ text: req.body.text, completed: false });
  await newTodo.save();
  res.json(newTodo);
});

app.put("/todos/:id", async(req,res) => {
  const todo = await Todo.findById(req.params.id);
  todo.completed = !todo.completed;
  await todo.save();
  res.json(todo);
});

app.deleted("/todos/:id", async(req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Todo Deletec"});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));