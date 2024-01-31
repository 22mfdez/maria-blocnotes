const express = require('express')
const bodyParser = require('body-parser')

const app = express()



const mongoose = require('mongoose');

// Define MongoDB URL, replace with your own connection string
const mongoDBUrl = 'mongodb+srv://maria:1234@cluster0.nqgxkqm.mongodb.net/bloc?retryWrites=true&w=majority';

mongoose.connect(mongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
  });

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  
});

// Definición del modelo de datos para las notas
const NoteSchema = new mongoose.Schema({
    content: {
      type: String,
      required: true,
    },
    // Aquí puedes agregar más campos si tus notas los necesitan
  });

const User = mongoose.model('User', UserSchema);
const Note = mongoose.model('Note', NoteSchema);

module.exports = User;

app.use(bodyParser.json())

app.get('/api', (req, res) => {
    res.json({message: 'Hello World'})
})

// Ruta para obtener todos los usuarios en formato JSON
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api', (req, res) => { //recibe un json con name y password
    const {name, password} = req.body
    
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server running on port PORT`)
})

app.post('/api/login', async (req, res) => {
    const { name, password } = req.body;
    const userReceived = { name, pass : password};

    try {
        // Buscar el usuario en la base de datos
        const user = await User.findOne(userReceived);
        console.log(user);

        if (user) {
            // Inicio de sesión exitoso
            res.status(200).json({ message: 'Login successful' });
        } else {
            // Credenciales inválidas
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Ruta para crear una nueva nota
app.post('/api/notes', (req, res) => {
  const newNote = new Note({
    content: req.body.content,
    // Aquí puedes agregar más campos si tus notas los necesitan
  });

  newNote.save()
    .then((note) => res.json({ success: true, note }))
    .catch((error) => res.json({ success: false, message: error.message }));
});