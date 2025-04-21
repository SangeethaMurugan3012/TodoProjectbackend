//Using Express
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')

//create an instance of express
const app = express();
app.use(express.json())
app.use(cors())

//Sample in-memory storage for todo items
let todos = [];

// connecting mongodb
mongoose.connect('mongodb+srv://sangeethamurugan3012:root@cluster0.s8pjk4s.mongodb.net/mern-app')
  .then(() => {
    console.log('DB Connected!');

  })
  .catch((err) => {
    console.log(err)
  })

//creating schema
const todoSchema = new mongoose.Schema({
  title: String,
  description: String
})

//creating model
const todoModel = mongoose.model('Todo', todoSchema);

//create a new todo item
app.post('/todos', async (req, res) => {
  const { title, description } = req.body;
  // const newTodo = {
  //     id: todos.length + 1,
  //     title,
  //     description
  // };
  // todos.push(newTodo);
  //  console.log(todos);
  //  res.status(201).json(newTodo);

  try {
    const newTodo = new todoModel({ title, description });
    await newTodo.save();
    res.status(200).json(newTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });

  }
})

//get all items
app.get('/todos', async (req, res) => {
  try {
    const todos = await todoModel.find();
    res.json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });

  }

})

//Update a todo item
app.put("/todos/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.id;
    const updatedTodo = await todoModel.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    )
    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" })
    }
    res.json(updatedTodo)
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });

  }
})

//Delete  a todo item
app.delete('/todos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });

  }

})

//Start the server
const port = 3600;
app.listen(port, () => {
  console.log("Server is listening to port" + port)
})





