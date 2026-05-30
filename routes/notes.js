const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const notesFile = path.join(__dirname, '..', 'data', 'notes.json');

// Helper function to read notes
async function getNotes() {
    try {
        const data = await fs.readFile(notesFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading notes:', error);
        return [];
    }
}

// Helper function to save notes
async function saveNotes(notes) {
    try {
        await fs.writeFile(notesFile, JSON.stringify(notes, null, 4), 'utf8');
    } catch (error) {
        console.error('Error saving notes:', error);
        throw error;
    }
}

// GET /api/notes - Retrieve all notes
router.get('/', async (req, res) => {
    try {
        const notes = await getNotes();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve notes' });
    }
});

// POST /api/notes - Create a new note
router.post('/', async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }

        const notes = await getNotes();
        
        const newNote = {
            id: crypto.randomUUID(),
            title,
            description,
            createdAt: new Date().toISOString()
        };

        notes.push(newNote);
        await saveNotes(notes);

        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save note' });
    }
});

// DELETE /api/notes/:id - Delete a note by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const notes = await getNotes();
        
        const filteredNotes = notes.filter(note => note.id !== id);
        
        if (notes.length === filteredNotes.length) {
            return res.status(404).json({ error: 'Note not found' });
        }

        await saveNotes(filteredNotes);
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

module.exports = router;
