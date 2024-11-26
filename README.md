# SmartDoc using Python
An Outlook Web Add-in to extract Attachments from Emails using python as the backend and Pure Javascript as frontend

This template is a modified version of the office Addin taskpane JS repository here: https://github.com/OfficeDev/Office-Addin-TaskPane-JS with a combination of the python webapp repository from here: https://github.com/Azure-Samples/python-docs-hello-world.
The html files are placed in the `Templates` folder while the assests pictures, javascript files, and css files are placed in the `static` folder. This is to help flask know where html, css, and javascript files would be.

## Test webapp before deployment
You can run flask locally for development
1. [Download the zip](https://github.com/mukeshrathore/SmartDoc-Python/archive/refs/heads/main.zip) or use `git clone https://github.com/mukeshrathore/SmartDoc-Python.git` then go to the root of the folder and perform the following commands:
```
py -3 -m venv .venv
.venv\scripts\activate
pip install -r requirements.txt
```

2. In cmd, vscode, or powershell, go to the root of your folder and type `python app.py` 
3. Go to OWA and add your maniest.xml. There are multiple methods dependings on your permissions and rights to your azure ad - 
- If you are an admin: https://docs.servicenow.com/bundle/quebec-employee-service-management/page/product/workplace-reservations-outlook-addin/task/upload-the-manifest-file-office365.html <br><br>

- If you are a normal user: <br>
  - Go to this link: https://aka.ms/olksideload <br>
  - From the “Custom Add-ins” pop-up click the “My Add-ins” tab <br>
  ![My Add-ins](https://learn.microsoft.com/en-us/office/dev/add-ins/images/outlook-sideload-my-add-ins-owa.png "My Add-ins")
  - On the “My Add-ins” tab scroll down to bottom of the page and click the “+ Add a Custom Add-in link. <br>
  ![+ Add a Custom Add-in](https://learn.microsoft.com/en-us/office/dev/add-ins/images/outlook-sideload-custom-add-in.png "Add a Custom Add-in")
  - In the older version of Outlook web you may have to go to Add-in management is available under “Settings” > “Manage Add-Ins” >  “Custom Add-ins” > “My Add-ins” > “+ Add a Custom Add-in”
  - select `file` and chose your `manifest.xml` file, then choose `install`
  
 **Note** - You will have to change your manifest file to the hosting url later. So you will have to remove and readd the new manifest file later on. 

## Deploy the sample
Follow the same instructions given from the microsoft website: https://docs.microsoft.com/en-us/azure/app-service/quickstart-python?tabs=powershell&pivots=python-framework-flask#deploy-the-sample

Once the sample is deployed, test your webapp's urls to make sure they work. 
After, you can modify the `manifest.xml` to route all `https://localhost:5000` urls to your own hosted url.

### Python dependencies version installed 
Successfully installed Deprecated-1.2.15 Pillow-11.0.0 PyPDF2-3.0.1 SQLAlchemy-2.0.35 aiohappyeyeballs-2.4.3 aiohttp-3.11.7 aiosignal-1.3.1 annotated-types-0.7.0 anyio-4.6.2.post1 attrs-24.2.0 certifi-2024.8.30 charset-normalizer-3.4.0 dataclasses-json-0.6.7 datasets-2.15.0 dill-0.3.7 filelock-3.16.1 frozenlist-1.5.0 fsspec-2023.10.0 greenlet-3.1.1 h11-0.14.0 httpcore-1.0.7 httpx-0.27.2 httpx-sse-0.4.0 huggingface-hub-0.26.2 idna-3.10 joblib-1.4.2 jsonpatch-1.33 jsonpointer-3.0.0 langchain-0.3.8 langchain-community-0.3.8 langchain-core-0.3.21 langchain-text-splitters-0.3.2 langsmith-0.1.146 lxml-5.3.0 marshmallow-3.23.1 mpmath-1.3.0 multidict-6.1.0 multiprocess-0.70.15 mypy-extensions-1.0.0 networkx-3.4.2 numpy-1.26.4 orjson-3.10.12 packaging-24.2 pandas-2.2.3 pikepdf-9.4.2 propcache-0.2.0 pyarrow-18.1.0 pyarrow-hotfix-0.6 pydantic-2.10.2 pydantic-core-2.27.1 pydantic-settings-2.6.1 pypdf-5.1.0 python-dateutil-2.9.0.post0 pytz-2024.2 pyyaml-6.0.2 regex-2024.11.6 requests-2.32.3 requests-toolbelt-1.0.0 safetensors-0.4.5 scikit-learn-1.5.2 scipy-1.14.1 setuptools-75.6.0 six-1.16.0 sniffio-1.3.1 sympy-1.13.1 tenacity-9.0.0 threadpoolctl-3.5.0 tokenizers-0.15.2 torch-2.5.1 tqdm-4.67.1 transformers-4.35.2 typing-extensions-4.12.2 typing-inspect-0.9.0 tzdata-2024.2 urllib3-2.2.3 wrapt-1.17.0 xxhash-3.5.0 yarl-1.18.0