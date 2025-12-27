// ---- DOM ELEMENTS ----
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const runBtn = document.getElementById("runBtn");
const clearBtn = document.getElementById("clearBtn");

const statusEl = document.getElementById("status");
const textBox = document.getElementById("textBox");
const outputEl = document.getElementById("output");

// ---- STATE ----
let recognition = null;
let listening = false;

let indentLevel = 0;
const INDENT = "    "; // 4 spaces

function setStatus(text) {
  statusEl.textContent = text;
}

function appendLine(line = "") {
  textBox.value += INDENT.repeat(indentLevel) + line + "\n";
}

// ---- SPEECH SETUP ----
function setupRecognition() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech Recognition not supported. Use Chrome or Edge.");
    return null;
  }

  const r = new SpeechRecognition();
  r.continuous = true;
  r.interimResults = false;
  r.lang = "en-US";

  r.onstart = () => setStatus("Listening...");
  r.onerror = (e) => setStatus("Error: " + e.error);

  r.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        const spoken = event.results[i][0].transcript.trim().toLowerCase();
        handleCommand(spoken);
      }
    }
  };

  r.onend = () => {
    if (listening) {
      try { r.start(); } catch {}
    } else {
      setStatus("Stopped");
    }
  };

  return r;
}

// ---- COMMAND HANDLER ----
function handleCommand(text) {
  // editor commands
  if (text === "clear") {
    textBox.value = "";
    outputEl.textContent = "(output will appear here)";
    indentLevel = 0;
    return;
  }

  if (text === "new line" || text === "next line") {
    appendLine("");
    return;
  }

  if (text === "indent") {
    indentLevel++;
    appendLine("");
    return;
  }

  if (text === "dedent") {
    indentLevel = Math.max(0, indentLevel - 1);
    appendLine("");
    return;
  }

  // python: print
  if (text.startsWith("print")) {
    const content = text.replace("print", "").trim();
    appendLine(`print("${content}")`);
    return;
  }

  // python: for loop
  if (text === "for loop") {
    appendLine("for i in range(5):");
    indentLevel++;
    appendLine("print(i)");
    indentLevel = Math.max(0, indentLevel - 1);
    return;
  }

  // python: if condition (example: "if i equals 3")
  if (text.startsWith("if ")) {
    const condition = text
      .replace(/^if\s+/, "")
      .replaceAll(" equals ", " == ")
      .replaceAll(" equal ", " == ")
      .replaceAll(" greater than ", " > ")
      .replaceAll(" less than ", " < ");

    appendLine(`if ${condition}:`);
    indentLevel++;
    appendLine(""); // leave cursor line indented
    return;
  }

  // default: add as comment so it doesn't break python
  appendLine(`# ${text}`);
}

// ---- RUN CODE (Flask call) ----
async function runCode() {
  outputEl.textContent = "Running...";
  try {
    const res = await fetch("/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: textBox.value })
    });
    const data = await res.json();
    outputEl.textContent = data.output ?? "(no output)";
  } catch (err) {
    outputEl.textContent = "Error calling backend: " + err;
  }
}

// ---- BUTTON EVENTS ----
startBtn.onclick = () => {
  if (!recognition) recognition = setupRecognition();
  if (!recognition) return;

  listening = true;
  startBtn.disabled = true;
  stopBtn.disabled = false;

  try { recognition.start(); } catch {}
};

stopBtn.onclick = () => {
  listening = false;
  startBtn.disabled = false;
  stopBtn.disabled = true;

  try { recognition.stop(); } catch {}
};

runBtn.onclick = runCode;

clearBtn.onclick = () => {
  textBox.value = "";
  outputEl.textContent = "(output will appear here)";
  indentLevel = 0;
};
