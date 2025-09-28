from flask import Flask, request, jsonify
from googletrans import Translator

app = Flask(__name__)
translator = Translator()

@app.route('/translate', methods=['POST'])
def translate_text():
    data = request.get_json()
    text = data.get("text")
    source = data.get("source", "sr")
    target = data.get("target", "en")

    result = translator.translate(text, src=source, dest=target)
    return jsonify({"translatedText": result.text})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)