# EchoChamber: An AI Persona Chat App

EchoChamber is a full-stack web application that allows users to explore how a single query can be interpreted and responded to by different AI personas. It features a clean, modern dark-themed frontend and a Node.js backend that communicates with the Gemini API.

---

## Features

- **Four Distinct AI Personas:** Receive unique responses from Optimistic, Sarcastic, Philosophical, and Practical AI personalities.  
- **Modern UI/UX:** Sleek, minimalist dark theme with smooth animations and responsive design for both desktop and mobile.  
- **Persistent Chat History:** Keep track of all messages and responses within the conversation thread.  
- **Copy to Clipboard:** Quickly copy any AI response using a convenient button.  
- **Theme Toggling:** Easily switch between dark and light themes with a single click.  

---

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- Node.js and npm installed on your machine.  
- A Gemini API key from [Google AI Studio](https://studio.google.com/).  

---

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with your API key:

   ```
   API_KEY=YOUR_GEMINI_API_KEY_HERE
   ```

   > Note: Replace `YOUR_GEMINI_API_KEY_HERE` with the actual API key (no quotes).

4. Run the backend server in development mode:

   ```
   npm run dev
   ```

   The server should start on http://localhost:3000.

---

### Frontend Setup

1. Open the `frontend` directory in the file explorer.  
2. Open `index.html` in a web browser.  
   (Using a live server extension such as VS Code Live Server is recommended.)

Your application is now running. Type a message in the text box and select a persona to get a response.

---

## Git Configuration

Ensure sensitive files are not committed. The `.gitignore` already handles this:

```
# Ignore backend environment file
backend/.env

# Ignore backend node_modules
backend/node_modules/

```

---


