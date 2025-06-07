import { useState, useEffect } from 'react';
import './TodoList.css';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Load tasks from localStorage on component mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('pomodoro-tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);
  
  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // Add a new task
  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    
    const task = {
      id: Date.now(),
      text: newTask,
      completed: false
    };
    
    setTasks([...tasks, task]);
    setNewTask('');
  };
  
  // Toggle task completion
  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  
  // Remove a task
  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Toggle list expansion
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className="todo-container">
      <div className="todo-header" onClick={toggleExpansion}>
        <h2>📋 Tasks</h2>
        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </div>
      
      {isExpanded && (
        <>
          <form className="todo-form" onSubmit={addTask}>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="todo-input"
            />
            <button type="submit" className="add-btn">+</button>
          </form>
          
          <div className="task-list">
            {tasks.length === 0 ? (
              <div className="empty-state">
                <p>No tasks yet. Add one to get started!</p>
              </div>
            ) : (
              tasks.map(task => (
                <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <div className="task-checkbox" onClick={() => toggleTask(task.id)}>
                    {task.completed && <span>✓</span>}
                  </div>
                  <div className="task-text" onClick={() => toggleTask(task.id)}>
                    {task.text}
                  </div>
                  <button className="delete-btn" onClick={() => removeTask(task.id)}>×</button>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TodoList;
