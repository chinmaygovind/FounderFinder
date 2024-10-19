from flask import Blueprint

# Import individual route modules
from .auth import auth_bp

# List of blueprints to be registered in the main app
__all__ = ["auth_bp"]
