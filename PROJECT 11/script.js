// Select DOM elements
const noteTitle = document.getElementById('noteTitle');
const noteText = document.getElementById('noteText');
const addNoteBtn = document.getElementById('addNote');
const notesList = document.getElementById('notesList');

// Load notes on page load
document.addEventListener('DOMContentLoaded', loadNotes);

// Add new note
addNoteBtn.addEventListener('click', () => {
  const title = noteTitle.value.trim();
  const text = noteText.value.trim();

  if (title === '' || text === '') {
    alert('Please enter both title and note text.');
    return;
  }

  const note = {
    id: Date.now(),
    title,
    text
  };

  saveNote(note);
  displayNote(note);
  noteTitle.value = '';
  noteText.value = '';
});

// Save note to localStorage
function saveNote(note) {
  let notes = getNotes();
  notes.push(note);
  localStorage.setItem('notes', JSON.stringify(notes));
}

// Get notes from localStorage
function getNotes() {
  return JSON.parse(localStorage.getItem('notes')) || [];
}

// Display all saved notes
function loadNotes() {
  const notes = getNotes();
  notes.forEach(note => displayNote(note));
}

// Display a single note
function displayNote(note) {
  const noteDiv = document.createElement('div');
  noteDiv.className = 'note';
  noteDiv.innerHTML = `
  <h3>${note.title}</h3>
  <p>${note.text}</p>
  <button class="delete-btn" onclick="deleteNote(${note.id})">Delete</button>
  <button class="edit-btn" onclick="editNote(${note.id})">Edit</button>
`;

  notesList.appendChild(noteDiv);
}

// Delete a note
function deleteNote(id) {
  if (!confirm('Are you sure you want to delete this note?')) return;
  let notes = getNotes();
  notes = notes.filter(note => note.id !== id);
  localStorage.setItem('notes', JSON.stringify(notes));
  notesList.innerHTML = '';
  loadNotes();
}

function editNote(id) {
  const notes = getNotes();
  const noteToEdit = notes.find(note => note.id === id);
  if (noteToEdit) {
    noteTitle.value = noteToEdit.title;
    noteText.value = noteToEdit.text;
    deleteNote(id); // Delete old version, user will save updated
  }
}

document.getElementById('searchInput').addEventListener('input', function () {
  const keyword = this.value.toLowerCase();
  const notes = getNotes();
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(keyword) ||
    note.text.toLowerCase().includes(keyword)
  );
  notesList.innerHTML = '';
  filteredNotes.forEach(note => displayNote(note));
});

const toggle = document.getElementById('darkModeToggle');

toggle.addEventListener('change', function () {
  document.body.classList.toggle('dark', this.checked);
  localStorage.setItem('darkMode', this.checked);
});

// Load dark mode setting
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('darkMode') === 'true') {
    toggle.checked = true;
    document.body.classList.add('dark');
  }
});
