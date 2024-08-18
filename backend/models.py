from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


        
class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer,primary_key=True,unique=True)
    email = db.Column(db.Text,nullable=False,unique=True)
    external_id = db.Column(db.Text,nullable=True)
    given_name = db.Column(db.Text)
    family_name = db.Column(db.Text)
    
    def to_json(self):
        return {
            "id": self.id,
            "email": self.email,
            "externalId": self.external_id,
            "givenName": self.given_name,
            "familyName": self.family_name
        }
    
    @classmethod
    def addUser(cls, external_id, email, given_name, family_name):
        user = cls(
            external_id=external_id,
            email=email,
            given_name=given_name,
            family_name=family_name
        )
        return user
    
        

class Store(db.Model):
    """Individual stores"""
    __tablename__ = "stores"    
    
    id = db.Column(db.Integer,primary_key=True) 
    storename = db.Column(db.Text,nullable=False)
    location = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    store_items = db.relationship('Item', cascade='all,delete-orphan')
    expenses = db.relationship('Expense', back_populates='store', lazy='dynamic')
    
    def to_json(self):
        return {
            "id":self.id,
            "storeName": self.storename,
            "location":self.location,
            "userId": self.user_id
        }
    
    

class Item(db.Model):
    """Shopping items"""
    __tablename__ = "items"
    id = db.Column(db.Integer,primary_key=True)
    itemname = db.Column(db.Text,nullable=False)
    quantity = db.Column(db.Integer)
    brand = db.Column(db.String)
    purpose = db.Column(db.String)
    price = db.Column(db.Integer)
    store_id = db.Column(db.Integer, db.ForeignKey('stores.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    
    def to_json(self):
        return {
            "id":self.id,
            "itemName":self.itemname,
            "quantity":self.quantity,
            "brand":self.brand,
            "purpose":self.purpose,
            "price":self.price,
            "category_id":self.category_id
        }
    
    
class Expense(db.Model):
    """Expenses"""
    __tablename__ = "expenses"
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    amount = db.Column(db.Integer, nullable=False)
    store_id = db.Column(db.Integer, db.ForeignKey('stores.id'), nullable=False)
    store = db.relationship('Store', back_populates='expenses')
    
    
    def to_json(self):
        return {
            "id":self.id,
            "date":self.date,
            "amount":self.amount,
            "store_id": self.store_id,
            "store_name": self.store.storename if self.store else None
        }
        
        
class Category(db.Model):
    """Categories"""
    __tablename__ = "categories"
    id = db.Column(db.Integer, primary_key=True)
    ordernumber = db.Column(db.Integer)
    category = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    items = db.relationship('Item', cascade='all,delete-orphan')
    
    def to_json(self):
        return {
            "id":self.id,
            "category":self.category,
            "ordernumber":self.ordernumber
        }
 
 
def connect_db(app):
    """Connect this database to provided Flask app"""
    db.app = app
    db.init_app(app)
    
    # Create all tables if they don't exist
    with app.app_context():
        try:
            # Try to query the database, avoids edge case with remote db on Render
            db.session.execute('SELECT 1')
        except Exception as e:
            print(f"Database connection error: {e}")
            print("Attempting to create tables...")
            db.create_all()
        else:
            print("Database connection successful")
