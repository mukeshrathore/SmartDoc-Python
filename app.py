import base64
import shutil
from flask import Flask, json
from flask import render_template
from flask.helpers import send_file
import os
import dotenv
from devcerts.install import ensure_certificates_are_installed 
import subprocess

dotenv.load_dotenv()

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/taskpane.html")
def taskpane():
    return render_template("taskpane.html")

@app.route("/commands.html")
def commands():
    return render_template("commands.html")

@app.route("/assets/logo-filled.png")
def iconlogofilled():
    return send_file("./static/assets/logo-filled.png",mimetype='image/png')

@app.route("/submit", methods=["POST"])
def submit():
    data = request.get_json()
    attachments = data['attachments']
    manifestData = data['manifestData']
    conversationId = manifestData.get("conversationId")
    directory = os.path.join(r'c:/Users/mukes/Downloads/SmartDoc',conversationId)
    
    # Remove the directory if it already exists
    if os.path.exists(directory):
        print(f"Directory {directory} already exists. Recreating it.")
        shutil.rmtree(directory)
        
    #create a directory with the conversationId as the name
    os.mkdir(directory)

    for attachment in attachments:
        name = attachment['name']
        content = attachment['content']

        # Decode the base64 content
        file_content = base64.b64decode(content)
        
        # Save the pdf files in the directory
        file_path = os.path.join(directory, name)
        with open(file_path, 'wb') as f:
            f.write(file_content)        
    
    # Save the mainfest file in the directory
    with open(os.path.join(directory, "manifest.json"), "w") as f:
        f.write(json.dumps(manifestData, indent=4))

    # Running the classifile model
    # subprocess.run(["python", "./classifile.py", directory])
    return "Attachments and Manifest uploaded successfully", 200

if __name__ == "__main__":
    if os.environ.get("APP_MODE") == "DEV":
        print("Running in DEV mode")
        # Call the function to ensure certificates are installed and valid
        ensure_certificates_are_installed()

        # Assuming the ensure_certificates_are_installed function updates the default paths as needed
        from devcerts.defaults import localhost_certificate_path, localhost_key_path
        from flask import request
        ssl_context = (localhost_certificate_path, localhost_key_path)
        
        app.run(debug=True, ssl_context=ssl_context)

    else:
        app.run(debug=True)
