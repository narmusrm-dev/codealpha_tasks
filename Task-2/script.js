// Load tasks from localStorage or start with empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');

// Render all tasks on page load
renderTasks();

// Add new task
taskForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const text = taskInput.value.trim();
    if (!text) return;

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
});

// Handle clicks on task items (complete, edit, delete, save)
taskList.addEventListener('click', function (e) {
    const target = e.target;
    const li = target.closest('.task-item');
    if (!li) return;

    const id = parseInt(li.dataset.id);

    if (target.classList.contains('task-checkbox')) {
        toggleComplete(id);
    } else if (target.classList.contains('btn-delete')) {
        deleteTask(id);
    } else if (target.classList.contains('btn-edit')) {
        startEdit(li, id);
    } else if (target.classList.contains('btn-save')) {
        saveEdit(li, id);
    }
});

// Handle Enter key in edit input
taskList.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.classList.contains('task-edit-input')) {
        const li = e.target.closest('.task-item');
        const id = parseInt(li.dataset.id);
        saveEdit(li, id);
    }
});

function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

function startEdit(li, id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const textSpan = li.querySelector('.task-text');
    const actionsDiv = li.querySelector('.task-actions');

    // Replace text with input
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'task-edit-input';
    input.value = task.text;
    textSpan.replaceWith(input);
    input.focus();
    input.select();

    // Replace action buttons with save button
    actionsDiv.innerHTML = '<button class="btn-save" title="Save">💾</button>';
}

function saveEdit(li, id) {
    const input = li.querySelector('.task-edit-input');
    if (!input) return;

    const newText = input.value.trim();
    if (!newText) return;

    const task = tasks.find(t => t.id === id);
    if (task) {
        task.text = newText;
        saveTasks();
        renderTasks();
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.completed ? ' completed' : '');
        li.dataset.id = task.id;

        li.innerHTML = `
            <div class="task-checkbox" title="Toggle complete"></div>
            <span class="task-text">${escapeHtml(task.text)}</span>
            <div class="task-actions">
                <button class="btn-edit" title="Edit">✏️</button>
                <button class="btn-delete" title="Delete">🗑️</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
