# AWS Node.js Deployment on EC2

This project demonstrates the deployment of a Node.js application on AWS EC2 using industry-standard deployment practices.

## Project Overview

A Node.js Notes Application was deployed on an Ubuntu EC2 instance and configured using:

* AWS EC2
* Ubuntu Linux
* Node.js
* PM2 Process Manager
* Nginx Reverse Proxy
* Git & GitHub
* SSH Remote Access

The objective of this project was to learn how real-world Node.js applications are deployed and managed on cloud infrastructure.

---

## Architecture

User Browser
↓
Nginx (Port 80)
↓
PM2 Process Manager
↓
Node.js Application (Port 3000)
↓
AWS EC2 Instance

---

## Deployment Steps

### 1. Launch EC2 Instance

* Ubuntu Server
* t2.micro Instance
* Security Group Configuration

  * Port 22 (SSH)
  * Port 80 (HTTP)
  * Port 443 (HTTPS)

### 2. Connect Using SSH

```bash
ssh -i key.pem ubuntu@<public-ip>
```

### 3. Install Node.js

```bash
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y
```

### 4. Clone Repository

git clone <repository-url>
cd aws-nodejs-deployment
```

### 5. Install Dependencies

```bash
npm install
```

### 6. Run Application

```bash
npm start
```

### 7. Install PM2

```bash
sudo npm install pm2 -g
```

Start application with PM2:

```bash
pm2 start server.js --name notes-app
```

Check status:

```bash
pm2 status
```

### 8. Install Nginx

```bash
sudo apt install nginx -y
```

Verify:

```bash
sudo systemctl status nginx
```

### 9. Configure Reverse Proxy

Nginx forwards incoming traffic from Port 80 to the Node.js application running on Port 3000.

```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

Validate configuration:

```bash
sudo nginx -t
```

Restart Nginx:

```bash
sudo systemctl restart nginx
```

---

## Key Learnings

* Linux server management
* SSH authentication
* AWS EC2 provisioning
* Security Group configuration
* Node.js deployment workflow
* PM2 process management
* Nginx reverse proxy configuration
* Production deployment fundamentals

---
##Screenshots

1)    ### Application Running on EC2
<img width="1438" height="832" alt="Screenshot 2026-05-30 at 12 02 23" src="https://github.com/user-attachments/assets/7f68d091-8e6c-47cd-a270-eaaffad911ce" />

2)   ### EC2 Instance Running
<img width="1440" height="831" alt="Screenshot 2026-05-30 at 12 02 50" src="https://github.com/user-attachments/assets/4a151bac-647a-44e3-860e-590f06bdd42e" />

3)### PM2 Process Status & Nginx Validation
<img width="748" height="325" alt="Screenshot 2026-05-30 at 12 09 13" src="https://github.com/user-attachments/assets/bfe1bbe8-6383-4e02-96a9-d6ed42a58ca3" />


## Repository

GitHub Repository:
https://github.com/roushankumar18/aws-nodejs-deployment

---

## Author

Roushan Kumar

B.Tech CSE (Artificial Intelligence)

Learning Cloud, Linux, AWS and DevOps.
