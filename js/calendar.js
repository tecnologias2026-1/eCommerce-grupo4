document.addEventListener('DOMContentLoaded', () => {
    const calendarDays = document.getElementById('calendar-days');
    const calendarYearSelector = document.getElementById('calendar-year-selector');
    const currentMonthText = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const selectedDateInfo = document.getElementById('selected-date-info');
    const displayDate = document.getElementById('display-date');
    const clearDateBtn = document.getElementById('clear-date');

    calendarYearSelector.addEventListener('change', () => {
        currentDate.setFullYear(parseInt(calendarYearSelector.value));
        renderCalendar();
    });

    let currentDate = new Date(2026, 3, 1); // Starting April 2026
    let selectedDate = null;

    // Mock booked dates (more scattered across years for example)
    const venueBookedDates = {
        'HACIENDA PAZ DEL RÍO': ['2026-04-11', '2026-05-16', '2027-06-12'],
        'HACIENDA SAN JUAN': ['2026-04-10', '2027-01-20', '2027-04-24'],
        'Hacienda Las Marías': ['2026-04-12', '2027-05-19', '2027-09-26'],
        'Hacienda El Cedro': ['2026-04-04', '2026-04-11', '2027-03-11'],
        'Hacienda Arkadia': ['2026-04-17', '2027-08-18', '2027-12-19'],
        'Hacienda Botania': ['2026-04-05', '2027-02-12', '2027-11-19']
    };

    const fullyBookedDates = ['2026-04-11', '2026-04-18', '2027-04-10', '2027-04-17'];

    function renderCalendar() {
        calendarDays.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        currentMonthText.innerText = monthNames[month];
        calendarYearSelector.value = year;

        // Add empty cells
        for (let i = 0; i < firstDay; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('calendar-day', 'empty');
            calendarDays.appendChild(emptyDiv);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('calendar-day');
            dayDiv.innerText = day;
            
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            if (fullyBookedDates.includes(dateStr)) {
                dayDiv.classList.add('booked');
                dayDiv.title = "No disponible";
            } else {
                dayDiv.addEventListener('click', () => selectDate(dateStr, dayDiv));
            }

            if (selectedDate === dateStr) {
                dayDiv.classList.add('selected');
            }

            calendarDays.appendChild(dayDiv);
        }
    }

    function selectDate(dateStr, element) {
        // Deselect previous
        const prevSelected = document.querySelector('.calendar-day.selected');
        if (prevSelected) prevSelected.classList.remove('selected');

        selectedDate = dateStr;
        element.classList.add('selected');
        
        selectedDateInfo.classList.remove('selected-date-info--hidden');
        displayDate.innerText = dateStr;
        
        localStorage.setItem('selectedWeddingDate', selectedDate);
        
        // Trigger global filter
        window.dispatchEvent(new CustomEvent('weddingDateChanged', { detail: { date: selectedDate, venueBookedDates } }));
    }

    clearDateBtn.addEventListener('click', () => {
        selectedDate = null;
        localStorage.removeItem('selectedWeddingDate');
        selectedDateInfo.classList.add('selected-date-info--hidden');
        const currentSelected = document.querySelector('.calendar-day.selected');
        if (currentSelected) currentSelected.classList.remove('selected');
        
        window.dispatchEvent(new CustomEvent('weddingDateChanged', { detail: { date: null, venueBookedDates } }));
    });

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Initial render
    renderCalendar();
    
    // Load stored date
    const storedDate = localStorage.getItem('selectedWeddingDate');
    if (storedDate) {
        selectedDate = storedDate;
        // If year/month matches, it will be highlighted in render
        displayDate.innerText = selectedDate;
        selectedDateInfo.classList.remove('selected-date-info--hidden');
        // Give time for other scripts to load
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('weddingDateChanged', { detail: { date: selectedDate, venueBookedDates } }));
        }, 100);
    }
});
