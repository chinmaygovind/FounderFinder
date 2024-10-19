from flask import Blueprint, request, jsonify
from models.user import User
from extensions import db

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
