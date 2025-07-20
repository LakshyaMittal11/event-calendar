
const calendar = document.getElementById('calendar');
const monthYear = document.getElementById('month-year');
const prevBtn = document.getElementById('prev-month');
const nextBtn = document.getElementById('next-month');
const modal = document.getElementById('event-modal');
const form = document.getElementById('event-form');

let currentDate = new Date();
let events = JSON.parse(localStorage.getItem('events')) || [];

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  monthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendar.innerHTML = '';

  for (let i = 0; i < firstDay; i++) {
    calendar.innerHTML += `<div class="day empty"></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayEvents = events.filter(e => e.date === fullDate);

    const dayBox = document.createElement('div');
    dayBox.className = 'day';
    if (new Date().toDateString() === new Date(year, month, d).toDateString()) {
      dayBox.classList.add('today');
    }

    dayBox.dataset.date = fullDate;
    dayBox.innerHTML = `<strong>${d}</strong>`;

    dayEvents.forEach(ev => {
      const evEl = document.createElement('div');
      evEl.className = 'event';
      evEl.style.backgroundColor = ev.color || '#5bc0de';
      evEl.textContent = ev.title;
      evEl.onclick = () => openModal(ev, fullDate);
      dayBox.appendChild(evEl);
    });

    dayBox.onclick = () => openModal(null, fullDate);
    calendar.appendChild(dayBox);
  }
}

function openModal(event = null, date) {
  modal.classList.remove('hidden');
  form.reset();
  form.dataset.date = date;
  form.dataset.id = event?.id || '';

  if (event) {
    document.getElementById('event-title').value = event.title;
    document.getElementById('event-time').value = event.time;
    document.getElementById('event-description').value = event.description;
    document.getElementById('event-repeat').value = event.repeat || 'none';
    document.getElementById('event-color').value = event.color || '#5bc0de';
  }
}

function closeModal() {
  modal.classList.add('hidden');
  form.reset();
}

form.onsubmit = function (e) {
  e.preventDefault();
  const newEvent = {
    id: form.dataset.id || Date.now().toString(),
    title: document.getElementById('event-title').value,
    time: document.getElementById('event-time').value,
    description: document.getElementById('event-description').value,
    repeat: document.getElementById('event-repeat').value,
    color: document.getElementById('event-color').value,
    date: form.dataset.date
  };

  events = events.filter(e => e.id !== newEvent.id);
  events.push(newEvent);
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
  renderCalendar();
};

document.getElementById('close-modal').onclick = closeModal;
document.getElementById('delete-event').onclick = () => {
  const id = form.dataset.id;
  events = events.filter(e => e.id !== id);
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
  renderCalendar();
};

prevBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};

nextBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

renderCalendar();
