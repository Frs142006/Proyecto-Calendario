class CalendarApp {
  constructor() {
    this.nav = 0;
    this.clicked = null;
    this.events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

    this.newEventModal = document.getElementById('newEventModal');
    this.deleteEventModal = document.getElementById('deleteEventModal');
    this.backDrop = document.getElementById('modalBackDrop');
    this.eventTitleInput = document.getElementById('eventTitleInput');
    this.importantButton = document.getElementById('importantButton');
    this.addAnotherButton = document.getElementById('addAnotherButton');
    this.isImportant = false;

    this.calendar = document.getElementById('calendar');
    this.weekdays = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];

    this.initImportantButton();
    this.initButtons();
    this.load();
  }

  formatDateString(day, month, year) {
    return `${day.toString().padStart(2,'0')}/${month.toString().padStart(2,'0')}/${year}`;
  }

  initImportantButton() {
    this.importantButton.addEventListener('click', () => {
      this.isImportant = !this.isImportant;
      this.importantButton.classList.toggle('active', this.isImportant);
    });
  }

  openModal(date) {
    this.clicked = date;
    const eventsDay = this.events.filter(e => e.date === date);

    const eventText = document.getElementById('eventText');
    eventText.innerHTML = '';

    if(eventsDay.length > 0) {
      this.deleteEventModal.style.display = 'block';
      this.newEventModal.style.display = 'none';
      eventsDay.forEach(ev => {
        const div = document.createElement('div');
        div.classList.add('eventView');
        div.innerHTML = `<span>${ev.title} ${ev.emoji || ''}</span> <span style="color:#f1c40f;">${ev.important ? '★' : ''}</span>`;
        eventText.appendChild(div);
      });
    } else {
      this.newEventModal.style.display = 'block';
    }

    this.backDrop.style.display = 'block';
  }

  load() {
    const date = new Date();
    if(this.nav !== 0) date.setMonth(new Date().getMonth() + this.nav);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const daysMonth = new Date(year, month, 0).getDate();
    const firstDayMonth = new Date(year, month-1, 1);
    const dateString = firstDayMonth.toLocaleDateString('es-AR',{weekday:'long',year:'numeric',month:'numeric',day:'numeric'});
    const paddingDays = this.weekdays.indexOf(dateString.split(',')[0].toLowerCase());

    document.getElementById('monthDisplay').innerText = `${date.toLocaleDateString('es-AR',{month:'long'})}, ${year}`;
    this.calendar.innerHTML = '';

    for(let i=1;i<=paddingDays+daysMonth;i++){
      const dayS = document.createElement('div');
      dayS.classList.add('day');

      const dayNum = i-paddingDays;
      const dayString = this.formatDateString(dayNum, month, year);

      if(i > paddingDays){
        dayS.innerText = dayNum;

        const eventsDay = this.events.filter(ev => ev.date === dayString);
        if(dayNum === day && this.nav===0) dayS.id = 'currentDay';

        eventsDay.forEach(ev=>{
          const eventDiv = document.createElement('div');
          eventDiv.classList.add('event');
          eventDiv.innerText = ev.title + (ev.emoji || '');
          if(ev.important) eventDiv.style.backgroundColor = '#f1c40f';
          dayS.appendChild(eventDiv);
        });

        dayS.addEventListener('click', ()=>this.openModal(dayString));
      } else {
        dayS.classList.add('padding');
      }

      this.calendar.appendChild(dayS);
    }
  }

  closeModal(){
    this.eventTitleInput.classList.remove('error');
    this.newEventModal.style.display='none';
    this.deleteEventModal.style.display='none';
    this.backDrop.style.display='none';
    this.eventTitleInput.value='';
    this.isImportant = false;
    this.importantButton.classList.remove('active');
    this.clicked = null;
    this.load();
  }

  saveEvent(){
    const title = this.eventTitleInput.value.trim();
    if(title){
      const emojiInput = document.getElementById('eventEmojiInput').value.trim();
      this.events.push({date:this.clicked, title, important:this.isImportant, emoji:emojiInput});
      localStorage.setItem('events', JSON.stringify(this.events));
      this.closeModal();
    } else {
      this.eventTitleInput.classList.add('error');
    }
  }

  deleteEvent(){
    this.events = this.events.filter(e => e.date !== this.clicked);
    localStorage.setItem('events', JSON.stringify(this.events));
    this.closeModal();
  }

  initButtons(){
    document.getElementById('backButton').addEventListener('click', ()=>{this.nav--;this.load();});
    document.getElementById('nextButton').addEventListener('click', ()=>{this.nav++;this.load();});
    document.getElementById('saveButton').addEventListener('click', ()=>this.saveEvent());
    document.getElementById('cancelButton').addEventListener('click', ()=>this.closeModal());
    document.getElementById('deleteButton').addEventListener('click', ()=>this.deleteEvent());
    document.getElementById('closeButton').addEventListener('click', ()=>this.closeModal());

    // NUEVO: botón "Agregar otro"
    this.addAnotherButton.addEventListener('click', ()=>{
      this.deleteEventModal.style.display = 'none';
      this.newEventModal.style.display = 'block';
      this.eventTitleInput.value = '';
      this.isImportant = false;
      this.importantButton.classList.remove('active');
    });
  }
}

const app = new CalendarApp();
