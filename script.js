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
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  monthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;
  calendar.innerHTML = '';
const today=new Date();
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
const dayNames=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
dayNames.forEach(day=>{
  const dayLabel=document.createElement('div');
  dayLabel.textContent=day;
  dayLabel.className='day-label';
  
  calendar.appendChild(dayLabel);
});
  for (let i = 0; i < firstDay; i++) {
     const emptyBox = document.createElement('div');
    emptyBox.className = 'day empty';
    calendar.appendChild(emptyBox);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
   const dayEvents = events.filter(e => {
  const eventDate = new Date(e.date);
  const calendarDate = new Date(dateStr);

  if (e.date === dateStr) return true;

  if (e.repeat === 'daily') {
    return calendarDate >= eventDate;
  }

  if (e.repeat === 'weekly') {
    return (
      calendarDate >= eventDate &&
      eventDate.getDay() === calendarDate.getDay()
    );
  }

  if (e.repeat === 'monthly') {
    return (
      calendarDate >= eventDate &&
      eventDate.getDate() === calendarDate.getDate()
    );
  }

  return false;
});

    const dayBox = document.createElement('div');
    dayBox.className = 'day';
    dayBox.dataset.date = dateStr;
    dayBox.innerHTML = `<strong>${d}</strong>`;
if(dateStr===todayStr){
  dayBox.classList.add('today');
}
    dayEvents.forEach(ev => {
      const el = document.createElement('div');
      el.className = 'event';
      el.style.backgroundColor = ev.color || 'lightblue';
      el.textContent = ev.title;
      el.onclick = e => {
        e.stopPropagation();
        openModal(ev, dateStr);
      };
      dayBox.appendChild(el);
    });

    dayBox.onclick = () => openModal(null, dateStr);
    calendar.appendChild(dayBox);
  }
}

function openModal(event = null, date) {
  modal.classList.remove('hidden');
  form.reset();
  form.dataset.date = date;
  form.dataset.id = event?.id || '';

  if (event) {
    form['event-title'].value = event.title;
    form['event-time'].value = event.time;
    form['event-description'].value = event.description;
    form['event-color'].value = event.color || '#5bc0de';
    form['event-repeat'].value = event.repeat || 'none';

  }
}

function closeModal() {
  modal.classList.add('hidden');
  form.reset();
}

form.onsubmit = e => {
  e.preventDefault();
  const timeValue=form['event-time'].value;
  const[date,time]=timeValue.split('T');
  const newEvent = {
    id: form.dataset.id || Date.now().toString(),
    title: form['event-title'].value,
    time: time,
    description: form['event-description'].value,
    color: form['event-color'].value,
    date: date,
    repeat: form['event-repeat'].value
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

