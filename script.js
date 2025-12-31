let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function format(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}h ${m}m`;
}

function addTask() {
  const name = document.getElementById("taskName").value.trim();
  if (!name) return;

  tasks.push({
    id: Date.now(),
    name,
    total: 0,
    running: false,
    start: null
  });

  save();
  render();
  document.getElementById("taskName").value = "";
}

function startTask(id) {
  const t = tasks.find(x => x.id === id);
  if (t.running) return;

  t.running = true;
  t.start = Date.now();
  save();
  render();
}

function endTask(id) {
  const t = tasks.find(x => x.id === id);
  if (!t.running) return;

  t.total += Date.now() - t.start;
  t.running = false;
  t.start = null;
  save();
  render();
}

function render() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(t => {
    const li = document.createElement("li");
    li.className = "task";

    li.innerHTML = `
      <b>${t.name}</b><br/>
      Tổng thời gian: ${format(t.total)}<br/>
      <button onclick="startTask(${t.id})">Start</button>
     
