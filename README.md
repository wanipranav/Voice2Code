🎙️ Voice-Controlled Python Coding Web App

A browser-based web application that allows users to write and execute Python code using voice commands.
The project focuses on accessibility, hands-free coding, and seamless integration between frontend speech recognition and backend Python execution.

🚀 Features

🎤 Voice-to-Code: Generate Python code using spoken commands

⚡ Real-time Speech Recognition using Web Speech API (Chrome / Edge)

🧠 Command-to-Code Translation (e.g., print, loops, conditionals)

▶️ Execute Python Code securely via Flask backend

🖥️ Live Output Display

🔐 Basic Safety Controls to restrict unsafe Python operations

📱 Responsive UI for desktop and mobile browsers

🛠️ Tech Stack

Frontend

HTML

CSS

JavaScript

Web Speech API

Backend

Python 3.14+

Flask

📂 Project Structure
Voice2Code/
│  app.py
│  requirements.txt
│
├─templates/
│    index.html
│
├─static/
│    app.js
│    style.css
│
└─.gitignore

▶️ How to Run Locally
1️⃣ Clone the repository
git clone https://github.com/YOUR_USERNAME/voice-controlled-python-web-app.git
cd voice-controlled-python-web-app

2️⃣ Create & activate virtual environment
py -m venv .venv
.venv\Scripts\activate

3️⃣ Install dependencies
pip install flask

4️⃣ Run the app
py app.py

5️⃣ Open in browser
http://127.0.0.1:5000


⚠️ Use Chrome or Microsoft Edge for speech recognition support.

🎙️ Example Voice Commands
Voice Command	Generated Python Code
“print hello world”	print("hello world")
“for loop”	for i in range(5): print(i)
“new line”	Moves cursor to next line
“clear”	Clears editor
🔐 Security Notes

Execution is local-only

Dangerous operations (os, sys, eval, open, etc.) are blocked

Built-in functions are restricted for safety

Designed for learning and demo purposes, not production use

💡 Motivation

This project was built to explore accessible developer tools and demonstrate how speech interfaces can enhance productivity and inclusivity in programming environments.

📌 Future Enhancements

Advanced voice grammar (natural language → code)

Monaco Editor (VS Code–style editor)

Docker-based sandbox execution

AI-assisted code generation

Deployment to cloud platforms (Render / Railway)

📄 License

This project is open-source and available under the MIT License.
