# 🎬 Goodbye, Eri - Interactive Web Novel

> *"I am a hypocrite. I only believe the lies I want to believe."*

A meta-narrative interactive web game inspired by Tatsuki Fujimoto's brilliant one-shot manga, **"Goodbye, Eri" (再见绘梨)**. 
Step into the shoes of Yuta, a young filmmaker navigating grief, memory, and the blurry lines between documentary truth and cinematic fiction.

## ✨ Features

- 🖥️ **Immersive OS Interface**
  Experience the narrative through a fully functional simulated desktop environment. Navigate between WeChat (chat), Notepad (diary clues), Maps (ruins theater), and Adobe Premiere (video editing).
  
- 💬 **Dynamic Chat System**
  A branching dialogue system that drives the story forward. Face the harsh criticisms of your classmates, and meet the mysterious girl, Eri, who will change how you see the world through a lens.

- 🎞️ **Interactive Video Editor (Mini-Game)**
  Become the editor of your own memories. Use a robust drag-and-drop timeline logic that evaluates your sequence narratively. Do you include the raw, ugly truth? Or do you wrap reality in a beautiful, supernatural lie?

- 🎭 **Cinematic Presentation**
  Featuring full-screen video cutscenes, frame-by-frame photo slideshows, and immersive CSS animations (like the *Tunnel of Light* transition) that give the web app a profound cinematic feel.

- 🔀 **Multiple Endings (5 Distinct Paths)**
  Your choices in the editing bay directly influence the conclusion. 
  - **Ending 1:** 真实的你 (The Real You - Midgame)
  - **Ending 2:** 梦醒时刻 (Awakening)
  - **Ending 3:** 最美的你 (The Most Beautiful You)
  - **Ending 4:** 你的另一面 (Your Other Side)
  - **Ending 5:** 真实的你？ (The Real You?)

## 🚀 Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Vanilla CSS (Glassmorphism, CSS Animations, Flexbox)
- **State Management:** React Context API (`GameContext`)

## 🛠️ Installation & Setup

1. **Clone the repository / Navigate to the folder:**
   ```bash
   cd goodbye_eri/game
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Play the game:**
   Open your browser and navigate to `http://localhost:5173`. 

## 🤫 Developer Cheat Mode

Testing the 5 different endings can take time if you sit through every typing animation and cutscene. For developers, there is a built-in cheat mode:

1. Open `src/GameContext.jsx`.
2. Find `export const CHEAT_MODE = false;` at the top of the file.
3. Change it to `true`.
4. Now, magical **"Skip" (跳过)** buttons will appear in the chat interface and during all video/photo cutscenes!

## 📜 License & Disclaimer

This is a non-commercial fan project created out of deep admiration for Tatsuki Fujimoto's original work. All story concepts belong to their respective copyright holders.
