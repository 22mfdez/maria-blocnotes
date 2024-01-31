const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');

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


// Ruta para crear un nuevo usuario
app.post('/api/login', async (req, res) => {//recibe un json con name y password y lo compara con la base de datos y si es correcto guarda el id en la sesion
  const { name, pass } = req.body;

  // Buscar al usuario en la base de datos
  const user = await User.findOne({ name });
  
  if (user && user.password === pass) {
    // Si el usuario existe y la contraseña es correcta, guardar su id en la sesión
    const token = jwt.sign({ name }, 'SECRETITOS', { expiresIn: '1h' });

    res.json({ token, message: "Logged in succesfully" });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

//ruta para   comprobar si el usuario esta logueado
app.get('/api/protected', (req, res) => { // si le paso el token me devuelve el contenido de la ruta
  const token = req.headers.authorization; // solo si el token es bueno le dejas pasar

  try {
    const user = jwt.verify(token, 'your-secret-key');

    // El token es válido, el usuario puede acceder a la ruta protegida...

  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Ruta para crear una nueva nota
app.post('/api/notes', (req, res) => {
  const newNote = new Note({
    content: req.body.content,
  });

  newNote.save()
    .then(note => {
      res.json({ success: true, note });
    })
    .catch(err => {
      res.json({ success: false, message: err.message });
    });
});
  
// Ruta para obtener todas las notas
app.get('/api/notes', (req, res) => {
  Note.find()
    .then(notes => {
      res.json({ success: true, notes });
    })
    .catch(err => {
      res.json({ success: false, message: err.message });
    });
}   );

// Ruta para actualizar una nota
app.put('/api/notes/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const note = await Note.findByIdAndUpdate(id, { content }, { new: true });
    res.json({ success: true, note });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Ruta para eliminar una nota
app.delete('/api/notes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Note.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});
