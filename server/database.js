import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Configuración de la conexión a la base de datos
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

async function completeTask(taskId) {
  try {
    const [result] = await pool.query('UPDATE tasks SET completed = 1 WHERE id = ?', [taskId]);
    if (result.affectedRows > 0) {
      return true;
    }
    return false;
  } catch (error) {
    throw new Error('Failed to complete task in the database');
  }
}

async function getUserByUsernameAndPassword(username, password) {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, password FROM users WHERE username = ?',
      [username]
    );

    if (rows.length > 0) {
      const user = rows[0];
      if (user.password === password) {
        return { user: user.username, userId: user.id };
      }
    }

    return null;
  } catch (error) {
    throw new Error('Error retrieving user from the database');
  }
}

async function registerUser(username, password, email, name) {
  try {
    // Insertar el nuevo usuario en la base de datos
    const query = 'INSERT INTO users (username, password, email, name) VALUES (?, ?, ?, ?)';
    const values = [username, password, email, name];
    const [result] = await pool.query(query, values);

    return result.insertId;
  } catch (error) {
    throw new Error('Error al registrar el usuario');
  }
}

// Método para obtener todas las tareas de un usuario
async function getCompletedTasks(userId) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM tasks WHERE userId = ? and completed = 1',
      [userId]
    );
    return rows;
  } catch (error) {
    throw new Error('Error al obtener las tareas del usuario');
  }
}

// Método para obtener todas las tareas de un usuario
async function getAllTasksByUserId(userId) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM tasks WHERE userId = ? and completed = 0',
      [userId]
    );
    return rows;
  } catch (error) {
    throw new Error('Error al obtener las tareas del usuario');
  }
}

async function createTask(userId, taskData) {
  try {
    const { title, description, duedate } = taskData;

    const query = 'INSERT INTO tasks (title, description, duedate, userId) VALUES (?, ?, ?, ?)';
    const values = [title, description, duedate, userId];

    const [result] = await pool.query(query, values);

    return result.insertId;
    
  } catch (error) {
    throw new Error('Error creating task2');
  }
}

async function deleteTask(taskId) {
  try {
    const query = 'DELETE FROM tasks WHERE ID = ?';
    const values = [taskId];
    await pool.query(query, values);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw new Error('Error deleting task');
  }
}


export { registerUser, createTask, deleteTask, getUserByUsernameAndPassword, getAllTasksByUserId, completeTask, getCompletedTasks };