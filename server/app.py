from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config
from routes import auth_bp
from extensions import db 

app = Flask(__name__)
app.config.from_object(Config)


# Register Blueprints
app.register_blueprint(auth_bp)
db.init_app(app)

# Initialize the database
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)


