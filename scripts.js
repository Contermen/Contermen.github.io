document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    checkDueDates();
});

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskDate = document.getElementById("taskDate");
    let taskTime = document.getElementById("taskTime");
    let taskPriority = document.getElementById("taskPriority");
    let taskList = document.getElementById("taskList");

    if (taskInput.value.trim() === "" || taskDate.value === "" || taskTime.value === "") return;

    let taskItem = {
        text: taskInput.value,
        date: taskDate.value,
        time: taskTime.value,
        priority: taskPriority.value,
        completed: false
    };

    saveTask(taskItem);
    renderTask(taskItem);
    taskInput.value = "";
    taskDate.value = "";
    taskTime.value = "";
}

function renderTask(task) {
    let taskList = document.getElementById("taskList");

    let li = document.createElement("li");
    li.classList.add(task.priority.toLowerCase());

    li.innerHTML = `
        <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTask(this)">
        <span class="${task.completed ? "completed" : ""}">
            ${task.text} - <small>${task.date} at ${formatTime(task.time)}</small> 
            <strong>(${task.priority})</strong>
        </span>
        <button class="delete-btn" onclick="deleteTask(this)">X</button>
    `;

    taskList.appendChild(li);
}

function formatTime(time) {
    let [hour, minute] = time.split(":");
    let period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${period}`;
}

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => renderTask(task));
}

function toggleTask(checkbox) {
    let taskText = checkbox.nextElementSibling;
    taskText.classList.toggle("completed");
    
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let index = Array.from(checkbox.parentElement.parentElement.children).indexOf(checkbox.parentElement);
    tasks[index].completed = checkbox.checked;
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(button) {
    let li = button.parentElement;
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let index = Array.from(li.parentElement.children).indexOf(li);
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    li.remove();
}

// Notify if a task is due today or overdue
function checkDueDates() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let today = new Date().toISOString().split('T')[0];

    tasks.forEach(task => {
        if (!task.completed) {
            if (task.date === today) {
                alert(`Reminder: "${task.text}" is due today at ${formatTime(task.time)}!`);
            } else if (task.date < today) {
                alert(`WARNING: "${task.text}" is overdue!`);
            }
        }
    });
}
