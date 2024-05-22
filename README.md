
# Getting started

## Prerequisites
Ensure you have Python 3 and Node.js installed on your system. The current project dependency versions are:
- Python 3.10

### Installation:
- Set up a virtual environment
```shell
# Install environment and dependencies
python3 -m venv .venv
source .venv/bin/activate

# or use this command on Windows
python3 -m venv .venv
.venv/Scripts/activate
```

- Install backend dependencies:
```shell
pip install -r backend/requirements.txt
```

- Apply database migrations:
```shell
# Apply migrations
python backend/manage.py migrate
```

- Run the Django development server:
```shell
# Run server
python backend/manage.py runserver
```

Now, your local server should be running, and you can access this Django/Angular application through your web browser at http://localhost:8000.
