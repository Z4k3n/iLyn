import express from 'express';
import { createTask, registerUser, deleteTask, getUserByUsernameAndPassword, getAllTasksByUserId, completeTask, getCompletedTasks } from './database.js';
import { exec } from 'child_process'

const app = express();

let userIdChat = 0;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://ilyn.herokuapp.com'); // Reemplaza "tudominio.com" con tu dominio real
  next();
});


app.use(express.json());

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Call the getUserByUsernameAndPassword function from the database module
  getUserByUsernameAndPassword(username, password)
    .then(user => {
      if (user) {
        res.status(200).json(user);
        userIdChat = user.userId;
      } else {
        res.status(401).json({ message: 'Incorrect credentials' });
      }
    })
    .catch(error => {
      console.error('Error in login:', error);
      res.status(500).json({ message: 'An error occurred' });
    });
});

app.post('/register', async (req, res) => {
  const { username, password, email, name } = req.body;
  try {
    const userId = await registerUser(username, password, email, name);
    res.json({ message: 'Usuario registrado exitosamente'});
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

app.post('/tasks', async (req, res) => {
  const { userId } = req.body;
  try {
    const tasks = await getAllTasksByUserId(userId);
    res.json({ tasks });
  } catch (error) {
    console.error('Error al obtener las tareas del usuario:', error);
    res.status(500).json({ error: 'Error al obtener las tareas del usuario' });
  }
});

app.post('/completedTasks', async (req, res) => {
  const userId = req.body.userId;
  try {
    const completedTasks = await getCompletedTasks(userId);
    res.json({ completedTasks });
  } catch (error) {
    console.error('Error al obtener las tareas del usuario:', error);
    res.status(500).json({ error: 'Error al obtener las tareas del usuario' });
  }
});

app.put('/completeTask/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    const updatedTask = await completeTask(taskId);

    if (updatedTask) {
      res.status(200).json({ message: 'Task completed successfully.' });
    } else {
      res.status(404).json({ message: 'Task not found.' });
    }
  } catch (error) {
    console.error('Failed to complete task.', error);
    res.status(500).json({ message: 'Failed to complete task.' });
  }
});

app.post('/tasks/delete', async (req, res) => {
  const { taskId } = req.body;
  try {
    await deleteTask(taskId);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
});

app.post('/saveTask', async (req, res) => {
  const taskData = req.body;
  const userId = userIdChat;

  console.log(taskData);
  console.log(userId);
  
  // Verificar si el usuario existe y tiene permiso para guardar la tarea
  if (userId) {
    // Agregar el user_id al objeto de datos de la tarea
    taskData.userId = userId;
    
    // Llamar al método de la base de datos para guardar la tarea
    const task = await createTask(userId, taskData);
    if (task) {
      res.status(200).json({ message: 'Task created successfully.' });
      res.redirect('/chat');
    } else {
      res.status(500).json({ message: 'Failed to create task.' });
    }
  } else {
    res.status(401).json({ message: 'User not authenticated.' });
  }
});


app.post('/tasks/add', async (req, res) => {
  const { userId, taskData } = req.body;
  try {
    const task = await createTask(userId, taskData);
    res.json({ task });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ error: 'Error al crear la tarea' , message: JSON.stringify(taskData)});
  }
});

app.post('/chat/send', (req, res) => {
  const message = req.body.message;

  // Ejecuta el script de Python y obtén la respuesta
  exec(`python3 iLyn.py "${message}"`, (error, stdout, stderr) => {
    if (error) {
      console.error('Error al ejecutar el script de Python:', error);
      res.status(500).json({ error: 'Error al procesar la solicitud' });
      return;
    }

    // Obtiene la respuesta del script de Python
    const response = stdout.trim();

    // Devuelve la respuesta como JSON al cliente
    res.json({ response });
  });
});

app.listen(5000, () => {
  console.log('Servidor iniciado en el puerto 5000');
});
