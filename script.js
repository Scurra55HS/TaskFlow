const taskInput = document.getElementById("taskInput");
const lists = {
    todo: document.getElementById("todo"),
    doing: document.getElementById("doing"),
    done: document.getElementById("done")
};

let tasks = JSON.parse(localStorage.getItem("taskflow-tasks")) || [];

/* ---------- INIT ---------- */
renderTasks();

/* ---------- ADD TASK ---------- */
const form = document.getElementById("taskForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!taskInput.value.trim()) return;

    const task = {
        id: Date.now(),
        text: taskInput.value.trim(),
        status: "todo"
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = "";
});


/* ---------- RENDER ---------- */
function renderTasks() {
    Object.values(lists).forEach(list => list.innerHTML = "");

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task";
        li.draggable = true;
        li.dataset.id = task.id;

        const span = document.createElement("span");
        span.textContent = task.text;

        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑️";
        delBtn.onclick = () => deleteTask(task.id);

        li.append(span, delBtn);
        lists[task.status].appendChild(li);

        addDragEvents(li);
    });
}

/* ---------- DELETE ---------- */
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

/* ---------- DRAG & DROP ---------- */
function addDragEvents(taskEl) {
    taskEl.addEventListener("dragstart", () => {
        taskEl.classList.add("dragging");
    });

    taskEl.addEventListener("dragend", () => {
        taskEl.classList.remove("dragging");
    });
}

Object.entries(lists).forEach(([status, list]) => {
    list.addEventListener("dragover", (e) => {
        e.preventDefault();
        list.classList.add("drag-over");
    });

    list.addEventListener("dragleave", () => {
        list.classList.remove("drag-over");
    });

    list.addEventListener("drop", () => {
        list.classList.remove("drag-over");

        const dragging = document.querySelector(".dragging");
        if (!dragging) return;

        const id = Number(dragging.dataset.id);
        const task = tasks.find(t => t.id === id);

        task.status = status;
        saveTasks();
        renderTasks();
    });
});

/* ---------- STORAGE ---------- */
function saveTasks() {
    localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
}
