# Production-Ready Full Stack Notes Application

A professional, full-stack Note taking application built with Node.js, Express, and Vanilla JavaScript. Features a modern, responsive UI and uses a local JSON file for storage.

## Features
- Create new notes with title and description
- View all notes in a responsive grid layout
- Delete notes securely
- Unique ID generation for each note
- Modern, clean UI with success/error alerts
- Responsive design (Mobile friendly)
- Zero external CSS frameworks (No Tailwind/Bootstrap)
- Backend API built with Express.js
- File-based storage (No database setup required)

## Folder Structure
```text
todo_app/
│
├── server.js            # Express server entry point
├── package.json         # Project dependencies and scripts
├── README.md            # Project documentation
├── .gitignore           # Git ignore rules
│
├── data/
│   └── notes.json       # JSON file storage for notes
│
├── routes/
│   └── notes.js         # API routes for notes operations
│
└── public/              # Static frontend assets
    ├── index.html       # Main HTML page
    ├── style.css        # Custom CSS styling
    └── script.js        # Vanilla JS logic for the frontend
```

## Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd todo_app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Local Development

Start the application locally using:
```bash
npm start
```
By default, the application runs on `http://localhost:3000`.

## API Documentation

### GET `/api/notes`
Retrieves a list of all notes.
- **Response**: `200 OK` (Returns an array of note objects)

### POST `/api/notes`
Creates a new note.
- **Body**: `{ "title": "String", "description": "String" }`
- **Response**: `201 Created` (Returns the created note object)

### DELETE `/api/notes/:id`
Deletes a specific note by ID.
- **Parameters**: `id` - Unique identifier of the note
- **Response**: `200 OK`

---

## AWS EC2 Deployment Steps

1. **Launch an EC2 Instance:**
   - Choose Ubuntu Server 22.04 LTS.
   - Configure Security Groups: Open port 22 (SSH), port 80 (HTTP), and optionally port 443 (HTTPS) / port 3000.

2. **Connect to your instance via SSH:**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Node.js & NPM:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Clone/Copy your project to the server:**
   ```bash
   git clone <repository-url> todo_app
   cd todo_app
   npm install
   ```

5. **Install PM2 globally:**
   ```bash
   sudo npm install pm2@latest -g
   ```

## PM2 Commands

Use PM2 to keep the application running in the background:

- Start the application:
  ```bash
  pm2 start server.js --name "notes-app"
  ```
- Make PM2 start on boot:
  ```bash
  pm2 startup ubuntu
  pm2 save
  ```
- Restart the application:
  ```bash
  pm2 restart notes-app
  ```
- View logs:
  ```bash
  pm2 logs notes-app
  ```

## Nginx Configuration Example

Install Nginx and set up a reverse proxy to forward traffic from port 80 to port 3000.

1. **Install Nginx:**
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **Configure Nginx:**
   Create a new file in `/etc/nginx/sites-available/notes-app`:
   ```bash
   sudo nano /etc/nginx/sites-available/notes-app
   ```

3. **Add the following configuration:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com or-your-ec2-ip;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Enable the configuration and restart Nginx:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/notes-app /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```
