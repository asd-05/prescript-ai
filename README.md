# Prescript-AI 🩺💊

Prescript-AI is a simple web application that helps users manage their medical prescriptions with ease.  
Upload a prescription, and the app will intelligently analyze it using **Google Gemini 2.5 Flash** model to extract important details about the prescribed medications. You can also set up medication reminders directly in your **Google Calendar**.

---

## ✨ Features
- 📄 Upload handwritten or digital prescriptions.  
- 🤖 Extract medicine names, dosages, and schedules with **Gemini 2.5 Flash**.  
- ⏰ Add reminders to your **Google Calendar**.  
- 🎨 Clean and responsive UI with **Next.js** and **Tailwind CSS**.  

---

## 🛠️ Tech Stack
- **Next.js** – Full-stack React framework  
- **Tailwind CSS** – Utility-first styling  
- **Google Gemini 2.5 Flash** – AI model for prescription analysis  
- **Google Calendar API** – Reminder scheduling  

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/prescript-ai.git
cd prescript-ai
```
### 2. Install dependencies
```bash
npm install
# or
yarn install
```
### 3. Set up environment variables
```bash
Create a .env.local file in the project root and add:
GOOGLE_API_KEY=your_google_api_key
GEMINI_API_KEY=your_gemini_api_key
```
### 4. Run the development server
```bash
npm run dev
# or
yarn dev
```
### 5. Start the app
Open http://localhost:3000 in your browser.