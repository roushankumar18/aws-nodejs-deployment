const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data directory and notes.json exist
const dataDir = path.join(__dirname, 'data');
const notesFile = path.join(dataDir, 'notes.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

if (!fs.existsSync(notesFile)) {
  fs.writeFileSync(notesFile, JSON.stringify([]), 'utf8');
}

// Routes
const notesRoutes = require('./routes/notes');
app.use('/api/notes', notesRoutes);

// Fallback to index.html for undefined routes (SPA behavior if needed)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
