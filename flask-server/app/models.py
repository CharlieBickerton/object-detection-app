from app import mongo, login_manager
from flask_login import UserMixin


class User(UserMixin):


    def __repr__(self):
        return f"User('{self.username}', '{self.email}', '{self.image_file}')"
