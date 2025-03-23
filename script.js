const monthYear = document.getElementById("monthYear");
const calendarDays = document.getElementById("calendarDays");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");

const taskModal = document.getElementById("taskModal");
const closeModal = document.querySelector(".close");
const modalDate = document.getElementById("modalDate");
const modalTaskList = document.getElementById("modalTaskList");

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

let currentDate = new Date();
let selectedDate = null;
let tasks = JSON.parse(localStorage.getItem("tasks")) || {}; 
let dailyTasks = JSON.parse(localStorage.getItem("dailyTasks")) || []; // Stores fixed daily tasks

// Render Calendar
function renderCalendar() {
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    monthYear.innerText = firstDayOfMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    calendarDays.innerHTML = "";

    // Empty slots before first day
    for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
        let emptyCell = document.createElement("div");
        calendarDays.appendChild(emptyCell);
    }

    // Actual days
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        let dayCell = document.createElement("div");
        dayCell.classList.add("day");
        dayCell.innerText = day;
        let dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;

        if (tasks[dateKey]?.completed) {
            dayCell.classList.add("completed");
        }

        dayCell.addEventListener("click", () => openTaskModal(dateKey));
        calendarDays.appendChild(dayCell);
    }
}

// Open Task Modal
function openTaskModal(dateKey) {
    selectedDate = dateKey;
    modalDate.innerText = `Tasks for ${dateKey}`;
    modalTaskList.innerHTML = "";

    dailyTasks.forEach(task => {
        let taskItem = document.createElement("div");
        taskItem.classList.add("modal-task");

        let taskText = document.createElement("span");
        taskText.innerText = task;

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = tasks[dateKey]?.completedTasks?.includes(task) || false;
        checkbox.addEventListener("change", () => markTaskCompleted(dateKey, task));

        taskItem.appendChild(taskText);
        taskItem.appendChild(checkbox);
        modalTaskList.appendChild(taskItem);
    });

    taskModal.style.display = "flex";
}

// Mark Task as Completed
function markTaskCompleted(dateKey, task) {
    if (!tasks[dateKey]) tasks[dateKey] = { completedTasks: [] };
    
    if (!tasks[dateKey].completedTasks.includes(task)) {
        tasks[dateKey].completedTasks.push(task);
    } else {
        tasks[dateKey].completedTasks = tasks[dateKey].completedTasks.filter(t => t !== task);
    }

    tasks[dateKey].completed = tasks[dateKey].completedTasks.length === dailyTasks.length;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderCalendar();
}

// Add Daily Task
addTaskBtn.addEventListener("click", () => {
    let taskText = taskInput.value.trim();
    if (taskText === "") return;

    dailyTasks.push(taskText);
    localStorage.setItem("dailyTasks", JSON.stringify(dailyTasks));
    renderDailyTasks();
    taskInput.value = "";
});

// Render Daily Tasks
function renderDailyTasks() {
    taskList.innerHTML = dailyTasks.map(task => `<li>${task}</li>`).join("");
}

closeModal.addEventListener("click", () => taskModal.style.display = "none");
prevMonthBtn.addEventListener("click", () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
nextMonthBtn.addEventListener("click", () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });

renderCalendar();
renderDailyTasks();
