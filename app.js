// DOM elements ko select kar rahe hain
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const addTaskBtn = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const clearAllBtn = document.getElementById('clearAll');
const filterButtons = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sortSelect');
const progressBar = document.getElementById('progressBar');
const emptyMessage = document.getElementById('emptyMessage');
const charCounter = document.getElementById('charCounter');
const toggleDarkModeBtn = document.getElementById('toggleDarkMode');

let tasks = []; // Saare tasks ko yahan store karenge
let filter = 'all'; // Default filter
let sortOrder = 'newest'; // Default sorting

// Task add karne ka function
function addTask() {
  const taskText = taskInput.value.trim();
  const priority = prioritySelect.value;

  if (taskText === '') {
    alert('Please enter a task!');
    return;
  }

  // Naya task object bana rahe hain
  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false,
    priority: priority,
    createdAt: new Date().getTime(),
  };

  tasks.push(newTask); // Array me task add karo
  saveTasks();
  renderTasks();

  // Input field clear karo aur character counter reset karo
  taskInput.value = '';
  updateCharCounter();
}

// Tasks ko localStorage me save karne ka function
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Tasks ko localStorage se load karne ka function
function loadTasks() {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  }
}

// Tasks ko screen par dikhane ka function
function renderTasks() {
  taskList.innerHTML = '';

  let filteredTasks = tasks;

  // Filter lagana
  if (filter === 'active') {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (filter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed);
  }

  // Sort karna
  filteredTasks.sort((a, b) => {
    if (sortOrder === 'newest') return b.createdAt - a.createdAt;
    else return a.createdAt - b.createdAt;
  });

  // Agar koi task nahi hai toh message dikhana
  if (filteredTasks.length === 0) {
    emptyMessage.style.display = 'block';
  } else {
    emptyMessage.style.display = 'none';
  }

  // Har task ko list me add karna
  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `list-group-item d-flex justify-content-between align-items-center ${
      task.completed ? 'completed' : ''
    }`;

    // Priority ke hisab se class lagani hai (color dot ke liye)
    li.classList.add(`priority-${task.priority}`);

    // Task text div
    const taskTextDiv = document.createElement('div');
    taskTextDiv.textContent = task.text;
    taskTextDiv.style.flex = '1';
    taskTextDiv.style.cursor = 'pointer';

    // Task click karne par complete/uncomplete toggle karna
    taskTextDiv.addEventListener('click', () => {
      toggleComplete(task.id);
    });

    // Delete button banana
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-sm btn-danger ms-3';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      deleteTask(task.id);
    });

    li.appendChild(taskTextDiv);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  updateProgressBar();
}

// Task complete/uncomplete toggle karne ka function
function toggleComplete(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  saveTasks();
  renderTasks();
}

// Task delete karne ka function
function deleteTask(id) {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
  }
}

// Clear all tasks karne ka function
function clearAllTasks() {
  if (confirm('Are you sure you want to clear all tasks?')) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
}

// Filter buttons ke events handle karna
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.getAttribute('data-filter');
    renderTasks();
  });
});

// Sorting select ka event
sortSelect.addEventListener('change', () => {
  sortOrder = sortSelect.value;
  renderTasks();
});

// Progress bar update karne ka function
function updateProgressBar() {
  if (tasks.length === 0) {
    progressBar.style.width = '0%';
    return;
  }
  const completedTasks = tasks.filter(task => task.completed).length;
  const percent = (completedTasks / tasks.length) * 100;
  progressBar.style.width = percent + '%';
}

// Character counter update karna
function updateCharCounter() {
  const remaining = 100 - taskInput.value.length;
  charCounter.textContent = `${remaining} characters left`;
}

// Dark mode toggle karna
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

// Input field me typing event se char counter update karna
taskInput.addEventListener('input', updateCharCounter);

// Add task button click event
addTaskBtn.addEventListener('click', addTask);

// Enter key press par bhi task add karna
taskInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Clear all button event
clearAllBtn.addEventListener('click', clearAllTasks);

// Dark mode button event
toggleDarkModeBtn.addEventListener('click', toggleDarkMode);

// Page load par tasks load karo aur render karo
window.addEventListener('load', () => {
  loadTasks();
  renderTasks();
  updateCharCounter();
});
