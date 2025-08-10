// Simple To-Do App with localStorage
const TASK_KEY = 'todos_v1';

let tasks = JSON.parse(localStorage.getItem(TASK_KEY) || '[]');

const taskList = document.getElementById('taskList');
const form = document.getElementById('taskForm');
const titleInput = document.getElementById('taskInput');
const dateInput = document.getElementById('taskDate');
const timeInput = document.getElementById('taskTime');
const showCompleted = document.getElementById('showCompleted');
const clearCompleted = document.getElementById('clearCompleted');
const clearAll = document.getElementById('clearAll');
const tpl = document.getElementById('taskTpl');

function save() {
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
}

function formatDateTime(dateStr, timeStr) {
  if (!dateStr && !timeStr) return '';
  if (!timeStr) return dateStr;
  return `${dateStr} ${timeStr}`;
}

function render() {
  taskList.innerHTML = '';
  const show = showCompleted.checked;
  tasks.forEach((t) => {
    if (!show && t.completed) return;
    const node = tpl.content.cloneNode(true);
    const li = node.querySelector('li');
    const chk = node.querySelector('.chk');
    const title = node.querySelector('.title');
    const dt = node.querySelector('.datetime');
    const editBtn = node.querySelector('.edit');
    const delBtn = node.querySelector('.delete');

    title.textContent = t.title;
    dt.textContent = formatDateTime(t.date, t.time);
    chk.checked = !!t.completed;
    if (t.completed) li.classList.add('completed');

    chk.addEventListener('change', () => {
      t.completed = chk.checked;
      save(); render();
    });

    delBtn.addEventListener('click', () => {
      if (confirm('Delete this task?')) {
        tasks = tasks.filter(x => x.id !== t.id);
        save(); render();
      }
    });

    editBtn.addEventListener('click', () => {
      // populate form for edit
      titleInput.value = t.title;
      dateInput.value = t.date || '';
      timeInput.value = t.time || '';
      // mark as editing by storing id on form
      form.dataset.editId = t.id;
      titleInput.focus();
    });

    taskList.appendChild(node);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const date = dateInput.value;
  const time = timeInput.value;
  if (!title) return alert('Please enter a task title.');

  const editId = form.dataset.editId;
  if (editId) {
    // update existing
    const idx = tasks.findIndex(t => t.id === editId);
    if (idx !== -1) {
      tasks[idx].title = title;
      tasks[idx].date = date;
      tasks[idx].time = time;
    }
    delete form.dataset.editId;
  } else {
    const newTask = {
      id: String(Date.now()) + Math.random().toString(16).slice(2),
      title, date, time, completed: false
    };
    tasks.unshift(newTask);
  }

  titleInput.value = '';
  dateInput.value = '';
  timeInput.value = '';
  save(); render();
});

showCompleted.addEventListener('change', render);

clearCompleted.addEventListener('click', () => {
  if (!confirm('Remove all completed tasks?')) return;
  tasks = tasks.filter(t => !t.completed);
  save(); render();
});

clearAll.addEventListener('click', () => {
  if (!confirm('Remove ALL tasks?')) return;
  tasks = [];
  save(); render();
});

// initial render
render();
