import os

# Directory structure to create
directories = [
    "FounderFinder",
    "FounderFinder/models",
    "FounderFinder/routes",
    "FounderFinder/utils",
    "FounderFinder/migrations",
    "FounderFinder/instance"
]

# Files with initial content
files = {
    "FounderFinder/app.py": """from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config
from routes import auth_bp

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)

# Register Blueprints
app.register_blueprint(auth_bp)

# Initialize the database
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
""",

    "FounderFinder/config.py": """class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///instance/users.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'your_secret_key'
""",

    "FounderFinder/models/user.py": """from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)
""",

    "FounderFinder/routes/auth.py": """from flask import Blueprint, request, jsonify
from models.user import User
from app import db

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400
    
    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username already exists"}), 409
    
    new_user = User(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "User created successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400
    
    user = User.query.filter_by(username=username).first()
    
    if user and user.check_password(password):
        return jsonify({"message": "Login successful"}), 200
    
    return jsonify({"message": "Invalid username or password"}), 401
""",

    "FounderFinder/routes/__init__.py": """from flask import Blueprint

# Import individual route modules
from .auth import auth_bp

# List of blueprints to be registered in the main app
__all__ = ["auth_bp"]
""",

    "FounderFinder/.dockerignore": """__pycache__/
*.pyc
instance/users.db
.env
*.sqlite3
""",

    "FounderFinder/Dockerfile": """# Use the official Python image as the base image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt file into the container
COPY requirements.txt .

# Install the required packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project into the container
COPY . .

# Expose the port on which the Flask app will run
EXPOSE 5000

# Command to run the Flask application
CMD ["python", "app.py"]
""",

    "FounderFinder/requirements.txt": """Flask
Flask-SQLAlchemy
Werkzeug
""",

    "FounderFinder/instance/users.db": "",  # Empty SQLite file
}

# Create directories
for directory in directories:
    os.makedirs(directory, exist_ok=True)

# Create files with content
for filepath, content in files.items():
    with open(filepath, 'w') as f:
        f.write(content)

print("Project structure created successfully!")
