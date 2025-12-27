from flask import Flask, render_template, request, jsonify
import io
import contextlib
import traceback

app = Flask(__name__)

@app.get("/")
def home():
    return render_template("index.html")

def safe_exec(user_code: str) -> str:
    # Basic safety: block obvious dangerous keywords.
    blocked = [
        "import os", "import sys", "subprocess", "socket", "shutil",
        "__import__", "eval(", "exec(", "open(", "pathlib"
    ]
    lower = user_code.lower()
    if any(b in lower for b in blocked):
        return "Blocked: restricted operation detected."

    # Allowed builtins (minimal)
    allowed_builtins = {
        "print": print,
        "range": range,
        "len": len,
        "sum": sum,
        "min": min,
        "max": max,
        "abs": abs,
        "sorted": sorted,
        "enumerate": enumerate,
        "zip": zip,
        "int": int,
        "float": float,
        "str": str,
        "list": list,
        "dict": dict,
        "set": set,
        "tuple": tuple,
    }

    stdout = io.StringIO()
    try:
        with contextlib.redirect_stdout(stdout):
            exec(user_code, {"__builtins__": allowed_builtins}, {})
        return stdout.getvalue() or "(no output)"
    except Exception:
        return traceback.format_exc()

@app.post("/run")
def run_code():
    data = request.get_json(force=True) or {}
    code = data.get("code", "")
    output = safe_exec(code)
    return jsonify({"output": output})

if __name__ == "__main__":
    app.run(debug=True)
