from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.schema import ForeignKeyConstraint, PrimaryKeyConstraint
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()
db = SQLAlchemy()


class User(db.Model):
   
    __tablename__="users"
    
    id = db.Column(db.Integer,primary_key=True,unique=True)
    username = db.Column(db.String(20),nullable=False, unique=True)
    password = db.Column(db.Text, nullable = False)
    first_name=db.Column(db.String,nullable=False)
    last_name=db.Column(db.String,nullable=False)
    postal_code = db.Column(db.String,nullable=False)
    
    email = db.Column(db.String(50), nullable=False)
    
    @classmethod
    def signup(cls,username, password, first_name,last_name, postal_code,email):
        hashed = bcrypt.generate_password_hash(password).decode("utf8")
      
        
        user = cls(
                username=username,
                password=hashed,
                first_name=first_name,
                last_name=last_name,
                email=email,
                postal_code=postal_code
            )
        
        db.session.add(user)    
        return user
    
    
    @classmethod
    def authenticate(cls,username,password):
        
        user = User.query.filter_by(username = username).first()
        
        if user and bcrypt.check_password_hash(user.password,password):
            return user
        else:
            return False
        
        
    def to_json(self):
        return {
            "id": self.id,
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "postal_code": self.postal_code
        }
        

class Store(db.Model):
    """Individual stores"""
    __tablename__ = "stores"    
    
    id = db.Column(db.Integer,primary_key=True) 
    storename = db.Column(db.Text,nullable=False)
    location = db.Column(db.Text)
    store_items = db.relationship('Item', cascade='all,delete-orphan')
    
    def to_json(self):
        return {
            "id":self.id,
            "storeName": self.storename,
            "location":self.location
        }
    
    

class Item(db.Model):
    """Shopping items"""
    __tablename__ = "items"
    id = db.Column(db.Integer,primary_key=True)
    itemname = db.Column(db.Text,nullable=False)
    quantity = db.Column(db.Integer)
    purpose = db.Column(db.String)
    store_id = db.Column(db.Integer, db.ForeignKey('stores.id'), nullable=False)
    
    def to_json(self):
        return {
            "id":self.id,
            "itemName":self.itemname,
            "quantity":self.quantity,
            "purpose":self.purpose
        }
    
class Expense(db.Model):
    """Expenses"""
    __tablename__ = "expenses"
    id = db.Column(db.Integer,primary_key=True)
    expense_name = db.Column(db.Text,nullable=False)
    amount = db.Column(db.Integer,nullable=False)
    
 
def connect_db(app):
    """Connect this database to provided Flask app"""
    db.app=app
    db.init_app(app)