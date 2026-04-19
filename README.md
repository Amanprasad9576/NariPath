# Ashoka-Innovate
AI-powered travel assistant for women focusing on safety, sustainability, and financial security.

## Overview
This project is an AI-driven travel assistant designed to enhance safety, sustainability, and financial security for women travelers through real-time intelligence and smart decision-making.

### Key Features
- *AI-Based Safety Score*: Uses machine learning to analyze locations, accommodations, and transit options, offering real-time safety insights.
- *Sustainable Travel Recommendations*: Suggests eco-friendly transport, ethical stays, and responsible tourism activities based on user preferences.
- *Smart Budgeting & FinTech Integration*: AI-driven expense tracking, multi-currency budgeting, and emergency financial assistance powered by blockchain.
- *Personalized Itinerary Planner*: Adapts travel plans based on real-time factors like weather, local events, and personal safety preferences.
- *Community Support & Alerts*: Connects solo travelers with verified local guides, safe travel communities, and real-time user-generated updates.

## Setup Instructions

This repository is split into two folders for clarity:
- `backend/` for Flask backend code
- `frontend/` for Next.js + Tailwind frontend code

### Backend
1. Navigate to the backend folder:
    sh
    cd backend

2. Install Python dependencies:
    sh
    pip install -r requirements.txt

3. Run the Flask backend:
    sh
    python app.py

4. Open `http://127.0.0.1:5000/` in your browser.

### Frontend
1. Navigate to the frontend folder:
    sh
    cd frontend

2. Install Node dependencies:
    sh
    npm install

3. Start the Next.js app:
    sh
    npm run dev

4. Open `http://localhost:3000/` in your browser.

## Project Structure

Ashoka-Innovate/
├── backend/
│   ├── app.py
│   ├── community.py
│   ├── fintech.py
│   ├── models.py
│   ├── requirements.txt
│   ├── static/
│   │   ├── scripts.js
│   │   └── styles.css
│   └── templates/
│       └── index.html
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
 │   ├── next.config.mjs
 │   └── postcss.config.js
├── README.md
└── .gitignore

## Future Enhancements
- Implement real AI models for safety scoring and itinerary planning.
- Integrate a real FinTech solution for budgeting and financial tracking.
- Implement user authentication and authorization.
- Develop a mobile application for better usability.
- Ensure data privacy and compliance with relevant laws.
