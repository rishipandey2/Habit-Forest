# 🌱 Habit Forest – A Beautiful Habit Tracking App

![Habit Forest Banner](https://github.com/user-attachments/assets/d8b83ea3-9794-458a-912a-e0d17475cabf)

Habit Forest is a habit tracking application that gamifies your daily routine by turning your habits into a **growing digital forest**. Each habit becomes a tree, and the more consistently you complete habits, the more your forest thrives.

> 🚀 Built for the [Appwrite Sites Hackathon 2025](https://appwrite.io).

---

## ✨ Live Demo
🔗 **Deployed App:** [https://habitforest.appwrite.network](https://habitforest.appwrite.network)  
🔗 **Source Code:** [GitHub Repository](https://github.com/your-username/habit-forest)

---

## 🌳 What is Habit Forest?

- **Each habit = One tree** in your personal forest  
- **Daily completions = Growth stages** for your trees  
- **Consistency = A thriving ecosystem**  

Your forest becomes a **visual representation of your personal growth**.

---

## 🎯 Tree Growth Stages

- 🌱 **Seed** (0–2 days) – Just planted  
- 🌿 **Sprout** (3–6 days) – Starting to grow  
- 🌳 **Growing** (7–13 days) – Healthy growth  
- 🌲 **Mature** (14–29 days) – Strong and established  
- 🏔️ **Mighty** (30+ days) – Towering achievement  

---

## 📊 Features

- 🔐 **Secure Authentication** (Appwrite auth with email/password)  
- 🎨 **Beautiful UI** (Notion-inspired, clean & responsive)  
- 🌱 **Habit Management** (create, edit, delete, mark complete)  
- 📈 **Progress Tracking** (habit streaks, total streak, stats)  
- 🏆 **Gamification** (points, achievements, celebrations)  
- 📊 **Smart Dashboard** (overview metrics + habit grid)  

---

## 🛠 Tech Stack

- [React](https://react.dev/) – modern frontend with hooks  
- [Vite](https://vitejs.dev/) – fast build tool  
- [Tailwind CSS](https://tailwindcss.com/) – utility-first styling  
- [Lucide Icons](https://lucide.dev/) – modern icon set  
- [Appwrite](https://appwrite.io/) – **backend, authentication, and database**  

---

## 🧮 Data Model (Appwrite)

- **Users (Auth Service)** → Authentication & profile management  
- **Databases**  
  - **Habits** → Stores habit name, description, user link  
  - **Completions** → Date-based records of completed habits  

Appwrite handles:  
- 🔐 Authentication (email/password login & secure sessions)  
- 🗄️ Database storage (habits + completions)  
- ⚡ Real-time sync (automatic updates across devices)  
- ☁️ Hosting (Appwrite Sites for deployment)  

---

## ⚡ Getting Started (Local Development)

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/habit-forest.git
   cd habit-forest

    Install dependencies

    npm install

2. **Setup environment variables**

       cp .env.example .env


3. **Run locally**

       npm run dev

🌍 Deployment (Appwrite Sites)

This project is deployed on Appwrite Sites for fast, secure, and global hosting.

    🚀 Continuous deployment from GitHub

    🌐 Global CDN with DDoS protection

    ⚙️ Environment variables configured via Appwrite Console

    📄 SPA fallback (index.html) enabled for React routing

Steps to Deploy:

    Push your project to a public GitHub repo

    Go to Appwrite Cloud Console

    → Sites

    Connect your GitHub repository

    Add environment variables in Build Settings

    Deploy → Appwrite will handle hosting automatically 🎉

🏆 Hackathon Compliance

    ✅ Built during hackathon (Aug 29 – Sept 12, 2025)

    ✅ Solo developer project

    ✅ Deployed on Appwrite Sites (.appwrite.network domain)

    ✅ Source code is open-source on GitHub

    ✅ Fully original with custom design & logic


🎉 Credits

    Design Inspiration: Notion’s minimal clean UI

    Icons: Lucide Icons

    Backend & Hosting: Appwrite

    Frontend Boilerplate: Vite
