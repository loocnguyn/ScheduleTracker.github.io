let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function format(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}h ${m}m ${s}s`;
}

function addTask() {
  const input = document.getElementById("taskName");
  const name = input.value.trim();
  if (!name) return;

  tasks.push({
    id: Date.now(),
    name,
    total: 0,
    running: false,
    start: null
  });

  input.value = "";
  save();
  render();
}

function startTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task || task.running) return;

  task.running = true;
  task.start = Date.now();
  save();
  render();
}

function endTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task || !task.running) return;

  task.total += Date.now() - task.start;
  task.running = false;
  task.start = null;
  save();
  render();
}

function render() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task";

    const runningTime = task.running
      ? task.total + (Date.now() - task.start)
      : task.total;

    li.innerHTML = `
      <b>${task.name}</b><br>
      Tổng thời gian: ${format(runningTime)}<br>
      <button onclick="startTask(${task.id})">Start</button>
      <button onclick="endTask(${task.id})">End</button>
    `;

    list.appendChild(li);
  });
}

// render khi load lại trang
render();

// cập nhật realtime mỗi giây
setInterval(render, 1000);
