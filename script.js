// 
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
    const today = new Date(); // Get today's date

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
        let currentDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

        // Highlight today's date
        if (day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()) {
            dayCell.classList.add("today");
        }

        // If tasks exist for this date and are completed, highlight it
        if (tasks[dateKey] && tasks[dateKey].completed) {
            dayCell.style.backgroundColor = "#6deb4e"; // Gold color for completed tasks
        }

        // Disable future dates
        if (currentDateObj > today) {
            dayCell.classList.add("disabled");
        } else {
            dayCell.addEventListener("click", () => openTaskModal(dateKey));
        }

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

    // Mark the task as completed only if all tasks for the day are checked
    tasks[dateKey].completed = tasks[dateKey].completedTasks.length === dailyTasks.length;

    localStorage.setItem("tasks", JSON.stringify(tasks));
    
    renderCalendar(); // Ensure the color updates after task completion
}

function renderDailyTasks() {
    taskList.innerHTML = "";
    dailyTasks.forEach((task) => {
      let taskItem = document.createElement("li");
      let taskText = document.createElement("span");
      taskText.textContent = task;
  
      let removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.classList.add("remove-task");
      removeBtn.addEventListener("click", () => removeTask(task));
  
      taskItem.appendChild(taskText);
      taskItem.appendChild(removeBtn);
      taskList.appendChild(taskItem);
    });
  }
  
  function removeTask(taskText) {
    dailyTasks = dailyTasks.filter((task) => task !== taskText);
    localStorage.setItem("dailyTasks", JSON.stringify(dailyTasks));
    renderDailyTasks();
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
/*function renderDailyTasks() {
    taskList.innerHTML = dailyTasks.map(task => `<li>${task}</li>`).join("");
    
}*/

// Close modal
closeModal.addEventListener("click", () => taskModal.style.display = "none");

// Navigation between months
prevMonthBtn.addEventListener("click", () => { 
    currentDate.setMonth(currentDate.getMonth() - 1); 
    renderCalendar(); 
});
nextMonthBtn.addEventListener("click", () => { 
    currentDate.setMonth(currentDate.getMonth() + 1); 
    renderCalendar(); 
});

// Initial Render
renderCalendar();
renderDailyTasks();
