// Base API URL
const API_URL = '/api/notes';

// DOM Elements
const noteForm = document.getElementById('note-form');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const submitBtn = document.getElementById('submit-btn');
const notesContainer = document.getElementById('notes-container');
const emptyState = document.getElementById('empty-state');
const noteCount = document.getElementById('note-count');
const alertContainer = document.getElementById('alert-container');

// Event Listeners
document.addEventListener('DOMContentLoaded', fetchNotes);
noteForm.addEventListener('submit', createNote);

// Utility: Show Alert Message
function showAlert(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = message;
    
    alertContainer.appendChild(alert);
    
    // Remove alert after 3 seconds
    setTimeout(() => {
        alert.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// Utility: Format Date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Fetch and display all notes
async function fetchNotes() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch notes');
        
        const notes = await response.json();
        renderNotes(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        showAlert('Failed to load notes', 'error');
    }
}

// Create a new note
async function createNote(e) {
    e.preventDefault();
    
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    
    if (!title || !description) {
        showAlert('Please fill in all fields', 'error');
        return;
    }
    
    // Disable button to prevent double submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description })
        });
        
        if (!response.ok) throw new Error('Failed to create note');
        
        // Reset form
        noteForm.reset();
        showAlert('Note created successfully!');
        
        // Refresh notes list
        fetchNotes();
    } catch (error) {
        console.error('Error creating note:', error);
        showAlert('Failed to create note', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Note';
    }
}

// Delete a note
async function deleteNote(id) {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete note');
        
        showAlert('Note deleted successfully!');
        
        // Refresh notes list
        fetchNotes();
    } catch (error) {
        console.error('Error deleting note:', error);
        showAlert('Failed to delete note', 'error');
    }
}

// Render notes to the DOM
function renderNotes(notes) {
    notesContainer.innerHTML = '';
    
    // Update count
    noteCount.textContent = `${notes.length} Note${notes.length !== 1 ? 's' : ''}`;
    
    if (notes.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    // Sort notes by newest first
    const sortedNotes = notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    sortedNotes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        
        noteCard.innerHTML = `
            <div class="note-header">
                <h3 class="note-title">${escapeHTML(note.title)}</h3>
            </div>
            <div class="note-body">${escapeHTML(note.description)}</div>
            <div class="note-footer">
                <span class="note-date">${formatDate(note.createdAt)}</span>
                <button onclick="deleteNote('${note.id}')" class="btn btn-danger">Delete</button>
            </div>
        `;
        
        notesContainer.appendChild(noteCard);
    });
}

// Utility: Prevent XSS attacks
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
