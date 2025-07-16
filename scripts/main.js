// Variables globales
let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

// Variables del modal
const newEvent = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');

// Elemento calendario
const calendar = document.getElementById('calendar');
const weekdays = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

// Funciones
function formatDateString(day, month, year) {
  return `${day.toString().padStart(2, '0')}/${(month).toString().padStart(2, '0')}/${year}`;
}

function openModal(date) {
  clicked = date;
  const eventDay = events.find(event => event.date === clicked);

  if (eventDay) {
    document.getElementById('eventText').innerText = eventDay.title;
    deleteEventModal.style.display = 'block';
  } else {
    newEvent.style.display = 'block';
  }

  backDrop.style.display = 'block';
}

function load() {
  const date = new Date();

  if (nav !== 0) {
    date.setMonth(new Date().getMonth() + nav);
  }

  const day = date.getDate();
  const month = date.getMonth() + 1; 
  const year = date.getFullYear();

  const daysMonth = new Date(year, month, 0).getDate();
  const firstDayMonth = new Date(year, month - 1, 1);

  const dateString = firstDayMonth.toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const paddingDays = weekdays.indexOf(dateString.split(', ')[0].toLowerCase());

  document.getElementById('monthDisplay').innerText = `${date.toLocaleDateString('es-AR', { month: 'long' })}, ${year}`;

  calendar.innerHTML = '';

  for (let i = 1; i <= paddingDays + daysMonth; i++) {
    const dayS = document.createElement('div');
    dayS.classList.add('day');

    const dayNum = i - paddingDays;
    const dayString = formatDateString(dayNum, month, year);

    if (i > paddingDays) {
      dayS.innerText = dayNum;

      const eventDay = events.find(event => event.date === dayString);

      if (dayNum === day && nav === 0) {
        dayS.id = 'currentDay';
      }

      if (eventDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventDay.title;
        dayS.appendChild(eventDiv);
      }

      dayS.addEventListener('click', () => openModal(dayString));
    } else {
      dayS.classList.add('padding');
    }

    calendar.appendChild(dayS);
  }
}

function closeModal() {
  eventTitleInput.classList.remove('error');
  newEvent.style.display = 'none';
  backDrop.style.display = 'none';
  deleteEventModal.style.display = 'none';
  eventTitleInput.value = '';
  clicked = null;
  load();
}

function saveEvent() {
  if (eventTitleInput.value.trim()) {
    eventTitleInput.classList.remove('error');

    const existingIndex = events.findIndex(event => event.date === clicked);

    if (existingIndex >= 0) {
      events[existingIndex].title = eventTitleInput.value;
    } else {
      events.push({
        date: clicked,
        title: eventTitleInput.value
      });
    }

    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add('error');
  }
}

function deleteEvent() {
  events = events.filter(event => event.date !== clicked);
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
}

// Botones
function buttons() {
  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });

  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById('saveButton').addEventListener('click', () => saveEvent());

  document.getElementById('cancelButton').addEventListener('click', () => closeModal());

  document.getElementById('deleteButton').addEventListener('click', () => deleteEvent());

  document.getElementById('closeButton').addEventListener('click', () => closeModal());
}

buttons();
load();
