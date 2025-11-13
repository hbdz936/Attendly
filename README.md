# Attendly - Your Attendance Ally

An attendance management system built for college students who need to stay on top of their class participation requirements.

## What It Does

Attendly helps you track attendance across all your subjects and tells you exactly where you stand. Input your data once, then simply mark yourself present or absent after each class. The system does the math so you don't have to.

**Key Features:**
- Real-time attendance percentage calculation
- Shows how many classes you need to attend to reach 75% (or your target)
- Shows how many classes you can safely miss
- Tracks multiple subjects independently
- Clean, no-nonsense interface

## Why This Exists

Most colleges require 75% attendance. Missing this threshold can mean detention classes, fee penalties, or even being barred from exams. This tool gives you visibility into your attendance status before it becomes a problem.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hbdz936/Attendly.git
cd Attendly
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

4. Set up environment variables:

Create a `.env` file in the `server` directory:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

Create a `.env` file in the `client` directory:
```
VITE_API_URL=http://localhost:5000
```

5. Start the server:
```bash
cd server
npm start
```

6. Start the client (in a new terminal):
```bash
cd client
npm run dev
```

The application will open at `http://localhost:5173`

## How It Works

### Initial Setup
For each subject, enter:
- Total classes held so far
- Classes you've attended
- Expected total classes for the semester

### Daily Use
After each class, just mark yourself present or absent. Attendly automatically:
- Updates your attendance percentage
- Calculates classes needed to reach 75%
- Shows how many classes you can miss while staying safe

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **State Management:** React Context API

## Contributing

Found a bug or have a feature request? Open an issue or submit a pull request.

---

Built by a student, for students who'd rather spend time studying than calculating attendance percentages.
