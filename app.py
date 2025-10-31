from flask import Flask, render_template, request, jsonify
from datetime import datetime
import random

app = Flask(__name__)

# ORA DI SBLOCCO: 19:30
TARGET_HOUR = 19
TARGET_MINUTE = 30

# ---- CIFRARIO DI CESARE ----
def caesar_cipher(text, shift):
    result = ""
    for char in text:
        if char.isalpha():
            start = ord('A') if char.isupper() else ord('a')
            result += chr((ord(char) - start + shift) % 26 + start)
        else:
            result += char
    return result

# ---- CIFRATURE RANDOM ----
def random_encrypt(text):
    methods = ["caesar", "numbers", "anagram", "phonetic"]
    choice = random.choice(methods)

    if choice == "caesar":
        return caesar_cipher(text, random.randint(1, 25))
    elif choice == "numbers":
        return " ".join(str(ord(c) - 96) if c.isalpha() else c for c in text.lower())
    elif choice == "anagram":
        return "".join(random.sample(text, len(text)))
    elif choice == "phonetic":
        alphabet = {
            'a': 'alpha', 'b': 'bravo', 'c': 'charlie', 'd': 'delta',
            'e': 'echo', 'f': 'foxtrot', 'g': 'golf', 'h': 'hotel',
            'i': 'india', 'l': 'lima', 'm': 'mike', 'n': 'november',
            'o': 'oscar', 'p': 'papa', 'q': 'quebec', 'r': 'romeo',
            's': 'sierra', 't': 'tango', 'u': 'uniform', 'v': 'victor',
            'z': 'zulu'
        }
        return " ".join(alphabet.get(c.lower(), c) for c in text)
    return text

@app.route("/")
def index():
    now = datetime.now()
    if now.hour < TARGET_HOUR or (now.hour == TARGET_HOUR and now.minute < TARGET_MINUTE):
        return render_template("index.html", before=True)
    else:
        return render_template("index.html", before=False)

@app.route("/level1")
def level1():
    shift = random.randint(1, 25)
    question = caesar_cipher("Quale è il vero nome di MarCS?", shift)
    return jsonify({"question": question, "shift": shift})

@app.route("/check_level1", methods=["POST"])
def check_level1():
    answer = request.json.get("answer", "").lower().strip()
    if answer in ["il merda", "il peggio"]:
        return jsonify({"correct": True})
    return jsonify({"correct": False})

@app.route("/end")
def end():
    text = "nel culo del merda"
    return jsonify({"message": random_encrypt(text)})

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Render fornisce la porta tramite variabile d’ambiente
    app.run(host="0.0.0.0", port=port)
