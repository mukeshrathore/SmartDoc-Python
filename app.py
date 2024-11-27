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
    print("Request payload:", request.get_json())

    print("manifestData conversationId:", request.get_json()["manifestData"].get("conversationId"))
    conversationId = request.get_json()["manifestData"].get("conversationId")
    directory = os.path.join(r'c:/Users/mukes/Downloads/SmartDoc',conversationId)
    
    # Remove the directory if it already exists
    if os.path.exists(directory):
        print(f"Directory {directory} already exists. Recreating it.")
        shutil.rmtree(directory)
        
    #create a directory with the conversationId as the name
    os.mkdir(directory)
    
    #copy the received data into json file and save it in the directory
    with open(os.path.join(directory, "manifest.json"), "w") as f:
        f.write(json.dumps(request.get_json()["manifestData"]))

    # subprocess.run(["python", "./classifile.py", directory])
    return "Success", 200

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
