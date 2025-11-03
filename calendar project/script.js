let currentDate = new Date();
let selectedDate = new Date();
let events = {}; 
let selectedColor = 'bg-blue-500';
let editingEventId = null;
let lastUpdatedDateKey = null; 

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const colorOptions = [
    { name: 'Blue', class: 'bg-blue-500' },
    { name: 'Red', class: 'bg-red-500' },
    { name: 'Green', class: 'bg-green-500' },
    { name: 'Yellow', class: 'bg-yellow-500' },
    { name: 'Purple', class: 'bg-purple-500' },
    { name: 'Pink', class: 'bg-pink-500' },
    { name: 'Orange', class: 'bg-orange-500' },
    { name: 'Indigo', class: 'bg-indigo-500' }
];

const calendarGrid = document.getElementById('calendarGrid');
const currentMonth = document.getElementById('currentMonth');
const currentYear = document.getElementById('currentYear');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const addEventBtn = document.getElementById('addEventBtn');
const eventModal = document.getElementById('eventModal');
const closeModal = document.getElementById('closeModal');
const cancelEvent = document.getElementById('cancelEvent');
const saveEvent = document.getElementById('saveEvent');
const deleteEventBtn = document.getElementById('deleteEvent');
const eventTitle = document.getElementById('eventTitle');
const eventTime = document.getElementById('eventTime');
const selectedDateDisplay = document.getElementById('selectedDateDisplay');
const colorOptionsContainer = document.getElementById('colorOptions');
const modalTitle = document.getElementById('modalTitle');
const monthListView = document.getElementById('monthListView');
const yearListView = document.getElementById('yearListView');

function initCalendar() {
    loadEvents();
    render(); 
    
    prevMonthBtn.addEventListener('click', () => navigateMonth(-1));
    nextMonthBtn.addEventListener('click', () => navigateMonth(1));
    addEventBtn.addEventListener('click', () => openEventModal(new Date(), null));
    closeModal.addEventListener('click', closeEventModal);
    cancelEvent.addEventListener('click', closeEventModal);
    saveEvent.addEventListener('click', saveNewEvent);
    deleteEventBtn.addEventListener('click', deleteSelectedEvent);
    
    currentMonth.addEventListener('click', (e) => {
        e.stopPropagation();
        showMonthList();
    });
    currentYear.addEventListener('click', (e) => {
        e.stopPropagation();
        showYearList();
    });
    
    eventModal.addEventListener('click', (e) => {
        if (e.target === eventModal) {
            closeEventModal();
        }
    });

    window.addEventListener('click', (e) => {
        if (!currentMonth.contains(e.target) && !monthListView.contains(e.target) &&
            !currentYear.contains(e.target) && !yearListView.contains(e.target)) {
            monthListView.classList.add('hidden');
            yearListView.classList.add('hidden');
        }
    });
}

function render() {
    updateMonthYear(); 
    renderDayGrid(); 
}

function getDaysInMonth(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day));
    }
    
    return days;
}

function renderDayGrid() {
    const days = getDaysInMonth(currentDate);
    calendarGrid.innerHTML = '';
    
    days.forEach((date, index) => {
        const dayElement = document.createElement('div');
        dayElement.className = 'min-h-24 p-2 rounded-xl cursor-pointer transition-all duration-300 calendar-day relative';
        dayElement.style.animationDelay = `${index * 10}ms`;
        dayElement.style.opacity = '0';
        dayElement.classList.add('animate-pop-in');
        
        if (date) {
            const dayEvents = getEventsForDate(date);
            const isToday = isTodayDate(date);
            const isSelected = isSelectedDate(date);
            
            const dateKey = date.toISOString().split('T')[0];
            if (dateKey === lastUpdatedDateKey) {
                dayElement.classList.add('animate-flash-day');
                lastUpdatedDateKey = null; 
            }
            
            if (isToday) {
                dayElement.classList.add('ring-2', 'ring-blue-400', 'bg-blue-50');
            }
            if (isSelected) {
                dayElement.classList.add('bg-gradient-to-br', 'from-blue-100', 'to-purple-100', 'ring-2', 'ring-purple-400');
            }
            if (!isToday && !isSelected) {
                dayElement.classList.add('hover:bg-gray-50');
            }
            
            const dayNumber = document.createElement('div');
            dayNumber.className = `text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-700'} ${isSelected ? 'text-purple-700' : ''}`;
            dayNumber.textContent = date.getDate();
            dayElement.appendChild(dayNumber);
            
            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'space-y-1 max-h-16 overflow-hidden';
            
            dayEvents.slice(0, 2).forEach((event, eventIndex) => {
                const eventElement = document.createElement('div');
                eventElement.className = `${event.color} text-white px-2 py-1 rounded truncate text-xs font-medium cursor-pointer`;
                eventElement.style.setProperty('--delay', eventIndex);
                eventElement.classList.add('event-item');
                
                if (event.time) {
                    const timeSpan = document.createElement('span');
                    timeSpan.className = 'font-semibold mr-1';
                    timeSpan.textContent = event.time + ' ';
                    eventElement.appendChild(timeSpan);
                }
                eventElement.appendChild(document.createTextNode(event.title));
                
                eventElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openEventModal(date, event.id);
                });
                
                eventsContainer.appendChild(eventElement);
            });
            
            if (dayEvents.length > 2) {
                const moreEvents = document.createElement('div');
                moreEvents.className = 'text-xs text-gray-500 flex items-center';
                const ellipsisIcon = document.createElement('svg');
                ellipsisIcon.className = 'ellipsis-icon mr-1';
                ellipsisIcon.setAttribute('viewBox', '0 0 24 24');
                ellipsisIcon.setAttribute('fill', 'none');
                ellipsisIcon.setAttribute('stroke', 'currentColor');
                ellipsisIcon.setAttribute('stroke-width', '2');
                ellipsisIcon.innerHTML = '<circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>';
                moreEvents.appendChild(ellipsisIcon);
                moreEvents.appendChild(document.createTextNode('+' + (dayEvents.length - 2) + ' more'));
                eventsContainer.appendChild(moreEvents);
            }
            
            dayElement.appendChild(eventsContainer);
            
            dayElement.addEventListener('click', () => openEventModal(date, null));
        }
        
        calendarGrid.appendChild(dayElement);
    });
}

function renderColorOptions() {
    colorOptionsContainer.innerHTML = '';
    colorOptions.forEach(color => {
        const colorButton = document.createElement('button');
        colorButton.className = `w-full h-10 rounded-lg border-2 transition-all duration-200 ${color.class}`;
        if (selectedColor === color.class) {
            colorButton.classList.add('border-gray-800', 'scale-105', 'shadow-md');
        } else {
            colorButton.classList.add('border-gray-200', 'hover:border-gray-400');
        }
        colorButton.title = color.name;
        colorButton.addEventListener('click', () => {
            selectedColor = color.class;
            renderColorOptions();
        });
        colorOptionsContainer.appendChild(colorButton);
    });
}

function navigateMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    render();
}

function updateMonthYear() {
    currentMonth.textContent = monthNames[currentDate.getMonth()];
    currentYear.textContent = currentDate.getFullYear();
}

function showMonthList() {
    monthListView.innerHTML = '';
    const currentMonthIndex = currentDate.getMonth();

    monthNames.forEach((month, index) => {
        const monthItem = document.createElement('div');
        monthItem.className = 'p-3 hover:bg-blue-50 cursor-pointer transition-colors';
        monthItem.textContent = month;
        if (index === currentMonthIndex) {
            monthItem.classList.add('bg-blue-100', 'font-semibold', 'text-blue-700');
        }
        monthItem.addEventListener('click', () => selectMonth(index));
        monthListView.appendChild(monthItem);
    });

    yearListView.classList.add('hidden'); 
    monthListView.classList.toggle('hidden');
}

function showYearList() {
    yearListView.innerHTML = '';
    const currentYearVal = currentDate.getFullYear();
    const startYear = currentYearVal - 10;
    const endYear = currentYearVal + 10;
    let activeYearElement = null;

    for (let year = startYear; year <= endYear; year++) {
        const yearItem = document.createElement('div');
        yearItem.className = 'p-3 text-center hover:bg-purple-50 cursor-pointer transition-colors';
        yearItem.textContent = year;
        if (year === currentYearVal) {
            yearItem.classList.add('bg-purple-100', 'font-semibold', 'text-purple-700');
            activeYearElement = yearItem;
        }
        yearItem.addEventListener('click', () => selectYear(year));
        yearListView.appendChild(yearItem);
    }
    
    monthListView.classList.add('hidden'); 
    yearListView.classList.toggle('hidden');

    if (activeYearElement && !yearListView.classList.contains('hidden')) {
        activeYearElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
}

function selectMonth(index) {
    currentDate.setMonth(index);
    monthListView.classList.add('hidden');
    render();
}

function selectYear(year) {
    currentDate.setFullYear(year);
    yearListView.classList.add('hidden');
    render();
}

function openEventModal(date, eventId) {
    selectedDate = date;
    editingEventId = eventId;
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    selectedDateDisplay.textContent = selectedDate.toLocaleDateString('en-US', options);
    
    if (eventId) {
        const dateKey = selectedDate.toISOString().split('T')[0];
        const event = events[dateKey].find(e => e.id === eventId);
        
        eventTitle.value = event.title;
        eventTime.value = event.time;
        selectedColor = event.color;
        modalTitle.textContent = 'Edit Event';
        saveEvent.textContent = 'Update';
        deleteEventBtn.classList.remove('hidden');
    } else {
        eventTitle.value = '';
        eventTime.value = '';
        selectedColor = 'bg-blue-500';
        modalTitle.textContent = 'Add Event';
        saveEvent.textContent = 'Add Event';
        deleteEventBtn.classList.add('hidden');
    }
    
    renderColorOptions(); 
    eventModal.classList.remove('hidden');
    eventModal.classList.remove('animate-fade-out');
    eventModal.classList.add('animate-fade-in');
}

function closeEventModal() {
    eventModal.classList.add('animate-fade-out');
    setTimeout(() => {
        eventModal.classList.add('hidden');
        eventModal.classList.remove('animate-fade-out');
        editingEventId = null;
    }, 300);
}

function saveNewEvent() {
    const title = eventTitle.value.trim();
    if (title) {
        const dateKey = selectedDate.toISOString().split('T')[0];
        events[dateKey] = events[dateKey] || [];
        
        if (editingEventId) {
            const eventIndex = events[dateKey].findIndex(e => e.id === editingEventId);
            if (eventIndex > -1) {
                events[dateKey][eventIndex] = {
                    ...events[dateKey][eventIndex],
                    title: title,
                    time: eventTime.value,
                    color: selectedColor
                };
            }
        } else {
            events[dateKey].push({
                title: title,
                time: eventTime.value,
                color: selectedColor,
                id: Date.now()
            });
        }
        
        lastUpdatedDateKey = dateKey; 
        saveEvents();
        closeEventModal();
        render();
    }
}

function deleteSelectedEvent() {
    if (!editingEventId) return;
    
    const dateKey = selectedDate.toISOString().split('T')[0];
    events[dateKey] = events[dateKey].filter(e => e.id !== editingEventId);
    
    if (events[dateKey].length === 0) {
        delete events[dateKey];
    }
    
    lastUpdatedDateKey = dateKey; 
    saveEvents();
    closeEventModal();
    render();
}

function saveEvents() {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
}

function loadEvents() {
    const storedEvents = localStorage.getItem('calendarEvents');
    if (storedEvents) {
        events = JSON.parse(storedEvents);
    }
}

function getEventsForDate(date) {
    if (!date) return [];
    const dateKey = date.toISOString().split('T')[0];
    return events[dateKey] || [];
}

function isTodayDate(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

function isSelectedDate(date) {
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
}

document.addEventListener('DOMContentLoaded', initCalendar);
