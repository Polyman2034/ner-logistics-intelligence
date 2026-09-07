# RouteMind — NER Logistics Intelligence

> AI-enabled logistics, route optimization, and road accessibility intelligence platform for the North Eastern Region of India.

[![Live Demo](https://img.shields.io/badge/Live-Demo-2ea44f?style=for-the-badge)](https://ner-logistics-intelligence-ij1t.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Polyman2034/ner-logistics-intelligence)

## Overview

**RouteMind** is an independently developed prototype that explores how **Artificial Intelligence, GIS, route optimization, and offline-first technologies** can improve logistics operations in challenging and low-connectivity regions.

The platform focuses on problems such as:

- Difficult terrain and road accessibility
- Road blockages and disruptions
- Inefficient logistics routes
- Delivery delays
- Limited network connectivity
- Lack of centralized logistics intelligence

The goal is to provide a unified platform for visualizing road conditions, analyzing incidents, exploring routes, and supporting logistics-related decision making.

## 🚀 Live Demo
# RouteMind — NER Logistics Intelligence Platform

> AI-enabled logistics, route optimization, and road accessibility intelligence for the North Eastern Region of India.

RouteMind is an independent prototype that explores how **AI, GIS, real-time road intelligence, and offline-first technologies** can be combined to improve logistics operations in regions affected by difficult terrain, road disruptions, traffic, and limited connectivity.

The platform is designed around a simple goal:

**Help logistics operators understand road conditions, identify risks, optimize routes, and make better delivery decisions.**

---

## Overview

Logistics operations in geographically challenging regions can be affected by:

- Road blockages and disruptions
- Difficult terrain and accessibility constraints
- Traffic and changing road conditions
- Delivery delays
- Inefficient route selection
- Limited network connectivity
- Lack of centralized road and incident intelligence

RouteMind explores a unified platform where logistics information can be monitored and operational decisions can be supported through **GIS visualization, AI-assisted insights, route optimization, incident reporting, and offline-first workflows**.

---

## Key Features

### 🗺️ GIS-Based Logistics Intelligence

Visualize logistics and road information on an interactive map.

- Road and highway visualization
- District-level accessibility information
- Risk and disruption zones
- Vehicle and delivery information
- Route visualization
- Road status indicators

### 🚚 Route Optimization

Explore safer and more efficient routes based on available logistics information.

- Route optimization
- Alternate route recommendations
- Safe corridor identification
- Delivery-aware routing
- Route risk consideration

### ⚠️ Incident & Road Blockage Reporting

Capture operational incidents that may affect logistics movement.

- Road blockage reporting
- Hazard reporting
- Incident verification workflow
- GPS-based incident information
- Offline incident capture

### 🤖 AI-Assisted Intelligence

Use AI to transform operational information into actionable insights.

- Logistics situation summaries
- Risk-oriented insights
- Route recommendations
- Operational briefings
- AI-assisted decision support

### 📡 Offline-First Operations

Designed for environments where reliable connectivity cannot always be assumed.

The application can maintain locally stored operational information and queue certain actions for synchronization when connectivity becomes available.

- Local data storage
- Offline incident capture
- Pending synchronization
- Network-aware workflows
- Local application data persistence

### 🌦️ Weather & Risk Awareness

Monitor environmental conditions that may affect transportation operations.

- Weather information
- Risk zones
- Road accessibility indicators
- Operational alerts

### 🌐 Multilingual Interface

The interface includes multilingual support to make the platform more accessible to users operating across different regions and language preferences.

---

## System Architecture

```text
                    ┌───────────────────────────┐
                    │        RouteMind UI       │
                    │   React + TypeScript      │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │       Application Layer   │
                    │   Components + Services    │
                    └─────────────┬─────────────┘
                                  │
                 ┌────────────────┼────────────────┐
                 │                │                │
                 ▼                ▼                ▼
        ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
        │ GIS & Maps   │  │ AI Services  │  │ Offline DB   │
        │ MapLibre     │  │ Gemini API   │  │ Dexie.js     │
        └──────────────┘  └──────────────┘  └──────────────┘
                 │                │                │
                 └────────────────┼────────────────┘
                                  ▼
                    ┌───────────────────────────┐
                    │       Express Server      │
                    │       Node.js Runtime     │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │       Data Layer          │
                    │    SQL / Application Data │
                    └───────────────────────────┘
**Website:**  
https://ner-logistics-intelligence-ij1t.onrender.com

> The application is deployed as a prototype and is intended for demonstration and research purposes.

## ✨ Key Features

### 🗺️ GIS & Map Intelligence
- Interactive map-based visualization
- Road and route visualization
- Location-based logistics information
- Accessibility and disruption awareness

### 🚚 Route Optimization
- Explore optimized logistics routes
- Consider road conditions and accessibility
- Identify alternative routes
- Support safer and more efficient transportation planning

### ⚠️ Incident Reporting
- Report road incidents and disruptions
- Capture incident information
- Track reported road conditions
- Support field-level data collection

### 🤖 AI-Assisted Intelligence
- AI-powered logistics insights
- AI-assisted analysis of transportation conditions
- Intelligent recommendations for logistics planning

### 📡 Offline-First Capability
- Local data storage using IndexedDB
- Offline data handling
- Designed for environments with unreliable connectivity
- Supports field-oriented workflows

### 🌐 Multilingual Interface
- Multilingual application interface
- Designed to improve accessibility for users across different regions

### 🌦️ Environmental Awareness
- Weather-related information
- Road and disruption awareness
- Risk-oriented logistics insights

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      User / Admin   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   RouteMind Web App │
                    │ React + TypeScript  │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        ┌───────────┐    ┌────────────┐   ┌────────────┐
        │ GIS / Map │    │ AI Service │   │ Offline DB │
        │ MapLibre  │    │ Gemini API │   │ IndexedDB  │
        └───────────┘    └────────────┘   └────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Express Backend     │
                    │ Node.js             │
                    └─────────────────────┘
```

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Backend | Node.js + Express |
| GIS | MapLibre GL JS |
| AI | Google Gemini API |
| Offline Storage | Dexie.js + IndexedDB |
| Icons | Lucide React |
| Database Scripts | SQL |
| Deployment | Render |

## 📁 Project Structure

```text
ner-logistics-intelligence/
│
├── assets/
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── server/
│   ├── aiService.ts
│   ├── dataStore.ts
│   └── routes.ts
│
├── src/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── lib/
│   ├── services/
│   ├── types/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── .env.example
├── index.html
├── package.json
├── server.ts
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- Git

### Clone the Repository

```bash
git clone https://github.com/Polyman2034/ner-logistics-intelligence.git
cd ner-logistics-intelligence
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_api_key_here
```

> Never commit your API key or other secrets to GitHub.

### Run the Application

```bash
npm run dev
```

The development server will start locally.

## 🏭 Production Build

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## ☁️ Deployment

RouteMind is deployed as a **single web service on Render**.

### Build Command

```bash
npm install && npm run build
```

### Start Command

```bash
npm start
```

### Live Application

https://ner-logistics-intelligence-ij1t.onrender.com

## 🔐 Security

- API keys are stored through environment variables.
- `.env` files are excluded from Git.
- Sensitive credentials should never be committed to the repository.

## 🔮 Future Improvements

Potential future development includes:

- Real-time vehicle tracking
- Live traffic data integration
- PostgreSQL/PostGIS integration
- Advanced multi-vehicle route optimization
- Predictive road disruption models
- Delivery ETA prediction
- Fleet management
- Real-time synchronization
- Role-based authentication
- Advanced logistics analytics
- Improved offline synchronization

## 🎯 Project Context

RouteMind was independently developed to explore the application of **AI, GIS, and intelligent optimization techniques** to transportation and logistics challenges in the **North Eastern Region (NER) of India**.

The project is an **independent prototype** and is not an official government system or official SIH submission.

## ⚠️ Disclaimer

RouteMind is developed for **educational, research, and demonstration purposes**.

AI-generated insights, routes, predictions, and operational information should be independently verified before being used for real-world logistics or transportation decisions.

## 👨‍💻 Author

**Saiprasad Kawdikar**

Computer Engineering Student

**Interests:**  
AI/ML • Full-Stack Development • GIS • Intelligent Systems

## 📄 License

This project is available under the license specified in the repository.

---

⭐ If you find this project interesting, consider giving the repository a star.
