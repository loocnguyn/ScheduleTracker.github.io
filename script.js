const STORAGE_KEY = "tasks_v2";

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function format(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}h ${m}m ${sec}s`;
}

function render() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  const now = Date.now();

  tasks.forEach(t => {
    const li = document.createElement("li");
    li.className = "task";

    const time = t.start ? t.total + (now - t.start) : t.total;

    li.innerHTML = `
      <b>${t.name}</b><br>
      ⏱ ${format(time)}<br>
      <button data-id="${t.id}" class="start">Start</button>
      <button data-id="${t.id}" class="end">End</button>
    `;

    list.appendChild(li);
  });
}

function addTask() {
  const input = document.getElementById("taskName");
  const name = input.value.trim();
  if (!name) return;

  tasks.push({
    id: Date.now(),
    name,
    total: 0,
    start: null
  });

  input.value = "";
  save();
  render();
}

document.addEventListener("click", e => {
  if (e.target.classList.contains("start")) {
    startTask(+e.target.dataset.id);
  }
  if (e.target.classList.contains("end")) {
    endTask(+e.target.dataset.id);
  }
});

function startTask(id) {
  const t = tasks.find(x => x.id === id);
  if (!t || t.start) return;

  t.start = Date.now();
  save();
  render();
}

function endTask(id) {
  const t = tasks.find(x => x.id === id);
  if (!t || !t.start) return;

  t.total += Date.now() - t.start;
  t.start = null;
  save();
  render();
}

document.getElementById("addBtn").addEventListener("click", addTask);

render();
setInterval(render, 1000);
