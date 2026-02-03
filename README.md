# Elegant notes 📝

A premium, sleek, and high-performance note-taking application designed for speed, security, and effortless organization. **Elegant notes** allows you to capture your thoughts locally for speed and sync them to the cloud for accessibility across all your devices.

![Elegant notes Preview](/public/favicon.png)

## ✨ Features

- **☁️ Cloud Sync & Multi-User**: Powered by Supabase. Your notes are securely stored and synced across devices.
- **🔐 Secure Authentication**: Full sign-up and login flow with personalized user profiles.
- **🌐 Public Note Sharing**: Generate unique, read-only links to share your notes with anyone, even if they don't have an account.
- **📱 Mobile Optimized**: A fully responsive design with a dedicated mobile sidebar and touch-friendly interface.
- **🚀 Lightning Fast**: Built with Vite and React for a near-instant user experience.
- **🎨 Minimalist Design**: Clean UI powered by Tailwind CSS and shadcn/ui with a premium glassmorphism aesthetic.
- **📌 Pin & Archive**: Keep critical notes at the top or archive completed thoughts to stay organized.
- **🏷️ Tagging System**: Categorize your notes with custom tags.
- **🌈 Color Coding**: Visually distinguish notes with an elegant color palette.
- **⌨️ Keyboard Shortcuts**:
  - `Ctrl + N`: New note
  - `Ctrl + F`: Quick search focus
  - `Ctrl + P`: Toggle pin

## 🛠️ Built With

- **Vite** - Frontend Tooling
- **React** - UI Library
- **Supabase** - Authentication & Database
- **TypeScript** - Type Safety
- **Zustand** - State Management
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component Library
- **Framer Motion** - Smooth Animations

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/)
- A [Supabase](https://supabase.com/) project

### Installation

1. **Clone the repository**:
   ```sh
   git clone <YOUR_GIT_URL>
   cd elegant-notes
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Initialize Database**:
   Run the SQL provided in `docs/schema.sql` (or see the Setup Guide in the artifacts) in your Supabase SQL Editor to create the `notes` table and RLS policies.

5. **Start Development**:
   ```sh
   npm run dev
   ```

## 📦 Deployment

Deploy easily to **Vercel** or **Netlify**:
1. Push your code to GitHub.
2. Link your repository.
3. Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the service's Environment Variables.
4. Build command: `npm run build`
5. Output directory: `dist`

## 📄 License

Distributed under the MIT License.

---

*Made with ❤️ for thinkers and creators.*
