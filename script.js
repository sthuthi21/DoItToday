const monthYear = document.getElementById("monthYear");
const calendarDays = document.getElementById("calendarDays");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");

const taskModal = document.getElementById("taskModal");
const closeModal = document.querySelector(".close");
const modalDate = document.getElementById("modalDate");
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

let currentDate = new Date();
let selectedDate = null; // Stores selected date for tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || {}; // Load saved tasks

function renderCalendar() {
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    monthYear.innerText = firstDayOfMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    calendarDays.innerHTML = "";
    
    // Add empty cells for previous month days
    for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
        let emptyCell = document.createElement("div");
        calendarDays.appendChild(emptyCell);
    }

    // Add actual days of the month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        let dayCell = document.createElement("div");
        dayCell.classList.add("day");
        dayCell.innerText = day;

        let dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;

        // Highlight today's date
        if (day === new Date().getDate() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear()) {
            dayCell.classList.add("today");
        }

        // If tasks exist for this date, highlight it
        if (tasks[dateKey] && tasks[dateKey].length > 0) {
            dayCell.style.backgroundColor = "#FFD700"; // Highlight with gold color
        }

        dayCell.addEventListener("click", () => openTaskModal(dateKey));
        calendarDays.appendChild(dayCell);
    }
}

// Open task modal
function openTaskModal(dateKey) {
    selectedDate = dateKey;
    modalDate.innerText = `Tasks for ${dateKey}`;
    taskList.innerHTML = ""; // Clear task list

    // Load tasks
    if (tasks[dateKey]) {
        tasks[dateKey].forEach(task => {
            let task1 = document.createElement("div");
            task1.innerText = task;
            let close
            taskList.appendChild(task1);
        });
    }

    taskModal.style.display = "flex";
}

// Close modal
closeModal.addEventListener("click", () => {
    taskModal.style.display = "none";
});

// Add task
addTaskBtn.addEventListener("click", () => {
    let taskText = taskInput.value.trim();
    if (taskText === "") return;

    if (!tasks[selectedDate]) {
        tasks[selectedDate] = [];
    }
    tasks[selectedDate].push(taskText);

    localStorage.setItem("tasks", JSON.stringify(tasks));
    taskInput.value = "";
    openTaskModal(selectedDate); // Refresh task list
    renderCalendar(); // Update calendar highlights
});

// Navigate months
prevMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// Initialize Calendar
renderCalendar();
