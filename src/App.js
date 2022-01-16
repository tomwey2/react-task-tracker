import {useState, useEffect} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import About from "./components/About";

const App = () => {
  const jsonServerUrl = "http://localhost:5000";
  const jsonContentType = "application/json";

  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchAllTasks();
      setTasks(tasksFromServer);
    };
    getTasks();
  }, []);

  // Fetch all tasks
  const fetchAllTasks = async () => {
    const res = await fetch(`${jsonServerUrl}/tasks`);
    const data = await res.json();
    return data;
  };

  // Fetch one task with id
  const fetchOneTask = async id => {
    const res = await fetch(`${jsonServerUrl}/tasks/${id}`);
    const data = await res.json();
    return data;
  };

  // Add tasks
  const addTask = async task => {
    console.log("add task", JSON.stringify(task));
    const res = await fetch(`${jsonServerUrl}/tasks`, {
      method: "POST",
      headers: {
        "Content-type": jsonContentType
      },
      body: JSON.stringify(task)
    });

    const data = await res.json();
    setTasks([...tasks, data]);
  };

  // Delete tasks with id
  const deleteTask = async id => {
    console.log("delete task with id", id);
    await fetch(`${jsonServerUrl}/tasks/${id}`, {
      method: "DELETE"
    });

    setTasks(tasks.filter(task => task.id !== id));
  };

  // Toggle reminder
  const toggleReminder = async id => {
    const taskToToggle = await fetchOneTask(id);
    const updatedTask = {...taskToToggle, reminder: !taskToToggle.reminder};

    const res = await fetch(`${jsonServerUrl}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": jsonContentType
      },
      body: JSON.stringify(updatedTask)
    });
    const data = await res.json();

    setTasks(
      tasks.map(task =>
        task.id === id ? {...task, reminder: !data.reminder} : task
      )
    );
  };

  // toggle add show task Button
  const toggleAddTaskButton = () => {
    setShowAddTask(!showAddTask);
  };

  return (
    <Router>
      <div className="container">
        <Header onAdd={toggleAddTaskButton} showAdd={showAddTask} />
        <Routes>
          <Route
            path="/"
            element={
              <>
                {showAddTask && <AddTask onAdd={addTask} />}
                {tasks.length > 0 ? (
                  <Tasks
                    tasks={tasks}
                    onDelete={deleteTask}
                    onToggle={toggleReminder}
                  />
                ) : (
                  "No Tasks to show"
                )}
              </>
            }
          />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
