const monthYear = document.getElementById("monthYear");
const calendarDays = document.getElementById("calendarDays");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");

let currentDate = new Date();

function renderCalendar() {
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    monthYear.innerText = firstDayOfMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    calendarDays.innerHTML = "";
    
    // Padding for first row
    for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
        let emptyCell = document.createElement("div");
        calendarDays.appendChild(emptyCell);
    }

    // Days of the month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        let dayCell = document.createElement("div");
        dayCell.classList.add("day");
        dayCell.innerText = day;

        // Highlight today's date
        if (day === new Date().getDate() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear()) {
            dayCell.classList.add("today");
        }

        calendarDays.appendChild(dayCell);
    }
}

// Navigation
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
