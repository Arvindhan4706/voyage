# 🌍 Voyage AI — Intelligent Travel Dashboard

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-voyage--ai--red.vercel.app-blue?style=for-the-badge)](https://voyage-ai-red.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Arvindhan4706%2Fvoyage--ai-black?style=for-the-badge&logo=github)](https://github.com/Arvindhan4706/voyage-ai)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

---

## 🌐 Live Website

**👉 [https://voyage-ai-red.vercel.app](https://voyage-ai-red.vercel.app)**

---

## ✨ Features

- 🤖 **AI Trip Planner** — Generate personalised itineraries using AI
- 🌡️ **Real-Time Weather** — Live temperature data via Open-Meteo API
- 🏨 **Hotel Sentiment Analysis** — NLP-based hotel ranking using BERT / RoBERTa
- 🗺️ **Interactive Destination Map** — Explore trending travel spots
- ✈️ **Flights Module** — Discover and compare flights
- 💬 **Community Section** — Share travel experiences
- 📊 **Insights Dashboard** — AI-powered travel analytics
- 🎬 **Netflix-style Trending** — Video card exploration of destinations
- 💰 **Smart Budget Optimizer** — Plan trips within your budget
- 🌿 **Sustainability Tracker** — Eco-friendly travel scoring

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | Full-stack React framework |
| **Prisma + SQLite** | Local database ORM |
| **Open-Meteo API** | Real-time weather data |
| **Framer Motion** | Animations & transitions |
| **NextAuth.js** | Authentication |
| **Tailwind CSS v4** | Styling |
| **Lucide React** | Icons |
| **Three.js / R3F** | 3D elements |
| **Vercel** | Deployment & hosting |

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/Arvindhan4706/voyage-ai.git
cd voyage-ai

# Install dependencies
npm install

# Set up the database
npx prisma db push
npx tsx prisma/seed.ts

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
voyage-ai/
├── prisma/              # Database schema & seed
├── src/
│   ├── app/
│   │   ├── api/         # REST API routes
│   │   └── page.tsx     # Main page
│   ├── components/      # UI components
│   └── lib/             # Utilities (prisma, auth)
└── public/              # Static assets
```

---

## 🌐 Deployment

Deployed on **Vercel** with automatic builds on every push to `master`.

**Production URL:** [https://voyage-ai-red.vercel.app](https://voyage-ai-red.vercel.app)

---

Made with ❤️ by [Arvindhan](https://github.com/Arvindhan4706)
