from flask import Flask
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import sqlite3
from extensions import db 
import sqlite3 
import datetime 
from functools import wraps
import json 
import os 
from dotenv import load_dotenv 

load_dotenv()
app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

def init_db():
    print("Creating database...")
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  email TEXT UNIQUE NOT NULL,
                  password TEXT NOT NULL)''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS profiles
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_id INTEGER,
                  user_email TEXT,
                  profile_data TEXT,
                  FOREIGN KEY (user_id) REFERENCES users (id))''')
    conn.commit()
    conn.close()

init_db()

@app.route
def ping():
    return "pong"

# Token required decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            print(data)
            current_user = data['user']
        except Exception as e:
            print(e)
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    hashed_password = generate_password_hash(password)

    try:
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        c.execute("INSERT INTO users (email, password) VALUES (?, ?)",
                  (email, hashed_password))
        conn.commit()
        conn.close()
        return jsonify({"message": "User created successfully"}), 201
    except sqlite3.IntegrityError as e:
        print(e)
        return jsonify({"message": "Email already exists"}), 400
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occurred"}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    try:
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        c.execute("SELECT * FROM users WHERE email = ?", (email,))
        user = c.fetchone()
        conn.close()

        if user and check_password_hash(user[2], password):
            token = jwt.encode({
                'user': email,
                'exp': datetime.datetime.now() + datetime.timedelta(hours=24)
            }, app.config['SECRET_KEY'])
            return jsonify({"message": "Login successful", "token": token}), 200
        else:
            return jsonify({"message": "Invalid email or password"}), 401
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occurred"}), 500

@app.route('/update_profile', methods=['POST'])
@token_required
def update_profile(current_user):
    data = request.json
    profile_data = data.get('profileData')
    
    if not profile_data:
        return jsonify({"message": "Profile data is required"}), 400

    try:
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        
        # Get user_id from email
        c.execute("SELECT id FROM users WHERE email = ?", (current_user,))
        user_id = c.fetchone()[0]

        # Check if profile exists
        c.execute("SELECT id FROM profiles WHERE user_id = ?", (user_id,))
        profile = c.fetchone()

        if profile:
            # Update existing profile
            c.execute("UPDATE profiles SET profile_data = ? WHERE user_id = ?, user_email = ?",
                      (json.dumps(profile_data), user_id, current_user))
        else:
            # Insert new profile
            c.execute("INSERT INTO profiles (user_id, profile_data, user_email) VALUES (?, ?, ?)",
                      (user_id, json.dumps(profile_data), current_user))

        conn.commit()
        conn.close()
        return jsonify({"message": "Profile updated successfully"}), 200
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500
    
if __name__ == '__main__':
    app.run(debug=True, port=5000)


