import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import logo from './images/logo.png';
import styles from './Chat.module.css';
import { v4 as uuidv4 } from 'uuid';

function Chat() {
  const MySwal = withReactContent(Swal);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'AI',
      content: 'Welcome to the chat!',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const [userMessage, setUserMessage] = useState('');

  const handleClearChat = () => {
    setMessages([{ sender: 'AI', content: 'Welcome to the chat!', timestamp: getCurrentTimestamp(), id: uuidv4() }]);
  };

  function getCurrentTimestamp() {
    const timestamp = new Date();
    return timestamp.toLocaleTimeString('en-US');
  }

  const handleUserMessageChange = (event) => {
    setUserMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) {
      return;
    }

    const timestamp = getCurrentTimestamp();
    const newMessage = {
      id: uuidv4(),
      sender: usuario,
      content: userMessage,
      timestamp: timestamp,
    };

    setMessages([...messages, newMessage]);
    setUserMessage('');

    // Hacer scroll hacia abajo después de agregar el mensaje
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 0);

    try {
      // Realiza una petición POST al endpoint correspondiente en tu servidor
      const response = await fetch('/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
      });

      // Verifica si la respuesta es exitosa
      if (response.ok) {

        const data = await response.json();
        const aiResponse = data.response;

        // Crea el objeto de mensaje de la AI con la respuesta obtenida
        const aiMessage = {
          id: uuidv4(),
          sender: 'AI',
          content: aiResponse,
          timestamp: getCurrentTimestamp(),
        };

        // Agrega el mensaje de la AI al estado de mensajes
        setMessages((prevMessages) => [...prevMessages, aiMessage]);

        // Hacer scroll hacia abajo después de agregar el mensaje
        setTimeout(() => {
          if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
          }
        }, 0);

      } else {
        console.error('Error al enviar el mensaje al servidor');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
    }
  };



  const [tasks, setTasks] = useState([]);
  const [hasTasks, setHasTasks] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  const obtenerUsuario = () => {
    if (localStorage.getItem('user') === null || localStorage.getItem('user') === undefined) {
      return 'user';
    } else {
      return localStorage.getItem('user');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Evitar que se realice el salto de línea por defecto
      handleSendMessage(userMessage); // Llamar a la función para enviar el mensaje
      setUserMessage(''); // Limpiar el campo de entrada de texto
    }
  };

  const messagesContainerRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
  };

  const formatDueDate = (dueDate) => {
    const date = new Date(dueDate);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const usuario = obtenerUsuario();

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) {
      MySwal.fire({
        title: 'Empty Task',
        text: 'Please enter a task title.',
        icon: 'warning',
        buttons: false,
        timer: 3000,
      });
      return;
    }

    try {
      const taskData = {};

      if (newTaskTitle) {
        taskData.title = newTaskTitle;
      }

      if (newTaskDescription) {
        taskData.description = newTaskDescription;
      }

      if (newTaskDueDate) {
        taskData.dueDate = newTaskDueDate;
      }

      const response = await fetch('/tasks/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: localStorage.getItem('userId'),
          taskData: taskData,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const { task } = responseData;

        // Actualizar la lista de tareas en el estado
        setTasks([...tasks, task]);

        // Limpiar los campos de creación de tareas
        setNewTaskTitle('');
        setNewTaskDescription('');
        setNewTaskDueDate('');

        // Mostrar un mensaje de éxito
        MySwal.fire({
          title: 'Task Added',
          text: 'The task has been added successfully.',
          icon: 'success',
          buttons: false,
          timer: 3000,
        }).then(() => {
          fetchTasks();
        });
      } else {
        // Manejo de errores al agregar la tarea
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

    } catch (error) {
      console.log('Error adding task:', error);

      // Mostrar un mensaje de error
      MySwal.fire({
        title: 'Error',
        text: 'An error occurred while adding the task.',
        icon: 'error',
        buttons: false,
        timer: 3000,
      });
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch('/tasks/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: taskId,
        }),
      });

      if (response.ok) {
        // Mostrar mensaje de éxito
        MySwal.fire({
          title: 'Task Deleted',
          text: 'The task has been deleted successfully.',
          icon: 'success',
          buttons: false,
          timer: 5000,
        }).then(() => {
          fetchTasks();
        });
      } else {
        // Manejo de errores al eliminar la tarea
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
    } catch (error) {
      console.log('Error deleting task:', error);
      // Mostrar mensaje de error
      MySwal.fire({
        title: 'Error',
        text: 'An error occurred while deleting the task.',
        icon: 'error',
        buttons: false,
        timer: 3000,
      });
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      // Realiza una petición PUT al servidor para marcar la tarea como completada
      const response = await fetch(`/completeTask/${taskId}`, {
        method: 'PUT',
      });

      if (response.ok) {
        // Actualiza la lista de tareas después de marcar una como completada
        MySwal.fire({
          icon: 'success',
          title: 'Task completed',
          text: 'The task has been successfully completed.',
          timer: 4000,
        }).then(() => {
          fetchTasks();
        });

      } else {
        console.error('Failed to complete task.');
        MySwal.fire({
          icon: 'error',
          title: 'Task completion failed',
          text: 'Failed to complete the task. Please try again later.',
        });
      }
    } catch (error) {
      console.error('Failed to complete task.', error);
    }
  };

  const handleCompletedTasks = () => {
    // Realizar una solicitud POST al servidor para obtener las tareas completadas
    fetch('/CompletedTasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: localStorage.getItem('userId') }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Obtener las tareas completadas del servidor
        if (data && data.completedTasks) {
          // Obtener las tareas completadas del servidor
          const completedTasks = data.completedTasks;
          setCompletedTasks(completedTasks);
          setShowCompletedTasks(completedTasks.length > 0);
        } else {
          // No se encontraron tareas completadas
          console.log('No hay tareas completadas');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: localStorage.getItem('userId'),
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const { tasks } = responseData;

        // Comprobar y establecer "Unset" para las fechas de vencimiento nulas
        const modifiedTasks = tasks.map(task => ({
          ...task,
          dueDate: task.dueDate !== null ? task.dueDate : "UNSET",
        }));

        setTasks(modifiedTasks);
        setHasTasks(modifiedTasks.length > 0);
      } else {
        // Manejo del error cuando no se recibe una respuesta exitosa
        throw new Error('Error al obtener las tareas del usuario');
      }
    } catch (error) {
      console.error('Error al obtener las tareas del usuario:', error);
      // Manejo del error al obtener las tareas
    }
  };


  useEffect(() => {


    if (usuario === 'user') {
      MySwal.fire({
        title: 'Not Registered',
        text: 'You are not registered. You will be redirected to the registration page.',
        icon: 'warning',
        timer: 5000,
      }).then(() => {
        window.location.href = '/register';
      });
    } else {
      fetchTasks();
    }
  }, []);

  return (
    <div className={styles['chat-body']}>
      <header className={styles['chat-header']}>
        <nav className={styles['chat-nav']}>
          <div className={styles['chat-container']}>
            <div className={styles['chat-logo']}>
              <img src={logo} width="60" alt="Logo" />
            </div>
            <h1 className={styles['chat-title']}>Welcome, {usuario}</h1>
            <a onClick={handleLogout} href="/" id="logout">Log Out</a>
          </div>
        </nav>
      </header>

      <main className={styles['chat-main']}>
        <aside className={styles['chat-card']}>
          <div>
            <h2 className={styles['chat-header-task']}>Pending Tasks</h2>
            {hasTasks ? (
              <ul id="taskList">
                {tasks.map((task) => (
                  <li key={task.id}>
                    <h3>{task.title}</h3>
                    <h4>{task.description}</h4>
                    <p>Due Date: {formatDueDate(task.duedate)}</p>
                    <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                    <button onClick={() => handleCompleteTask(task.id)}>Complete</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tasks available</p>
            )}
            <div>
              <button onClick={() => setShowAddTaskForm(true)}>Add New Task</button>
              <button
                onClick={() => {
                  if (showCompletedTasks) {
                    setShowCompletedTasks(false);
                  } else {
                    handleCompletedTasks();
                    setShowCompletedTasks(true);
                  }
                }}
              >
                {showCompletedTasks ? 'Hide Completed Tasks' : 'Show Completed Tasks'}
              </button>


            </div>
            {showAddTaskForm && (
              <div className={styles['add-task-form']}>
                <h3>Add New Task</h3>
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTaskTitle}
                  onChange={(event) => setNewTaskTitle(event.target.value)}
                />
                <textarea
                  placeholder="Task description"
                  value={newTaskDescription}
                  onChange={(event) => setNewTaskDescription(event.target.value)}
                  rows={4}
                ></textarea>
                <label htmlFor="newTaskDueDate">Due Date: </label>
                <input
                  type="date"
                  placeholder="Enter due date"
                  value={newTaskDueDate}
                  onChange={(event) => setNewTaskDueDate(event.target.value)}
                />
                <div>
                  <button onClick={handleAddTask}>Add</button>
                  <button onClick={() => setShowAddTaskForm(false)}>Cancel</button>
                </div>
              </div>
            )}
            {showCompletedTasks && (
              <div>
                <br></br>
                <hr></hr>
                <br></br>
                <h2 className={styles['chat-header-task']}>Completed Tasks</h2>
                {completedTasks.length > 0 ? (
                  <ul id="completedTask">
                    {completedTasks.map((task) => (
                      <li key={task.id}>
                        <h3>{task.title}</h3>
                        <h4>{task.description}</h4>
                        <p>Due Date: {formatDueDate(task.duedate)}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>You haven't completed any task yet. Time to act!</p>
                )}
              </div>
            )}

          </div>
        </aside>

        <div className={styles['chat']}>
          <div className={styles['chat-header2']}>
            <h2>Chat</h2>
            <button id="reset" onClick={handleClearChat}>Clear chat</button>
          </div>

          <div className={styles['chat-messages']} ref={messagesContainerRef}>
            {messages.map((message) => (
              <div
                className={`message ${message.sender === 'AI' ? styles['ai-message'] : styles['user-message']}`}
                key={message.id}
              >
                <div className="message-header">
                  <span className={`username ${styles['ai-username']}`}>{message.sender}</span>
                  <span className="timestamp">{message.timestamp}</span>
                </div>
                <div className="message-body">
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles['chat-input']}>
            <input
              type="text"
              placeholder="Write your message..."
              value={userMessage}
              onChange={handleUserMessageChange}
              onKeyPress={handleKeyPress}
              id="message-input"
              autoFocus
            />
            <button id="send-button" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Chat;
