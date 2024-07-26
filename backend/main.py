import os
from flask import jsonify,request
from config import app
from models import connect_db, User,Store,Item,Expense,Category,db
from expense_helpers import time_frame_functions
from expense_helpers import pie_chart_functions
from functools import wraps
from jose import jwt
from jose.exceptions import JWTError
import requests


class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


def get_token_auth_header():
    """Obtains the Access Token from the Authorization Header"""
    auth = request.headers.get("Authorization", None)
    if not auth:
        raise AuthError({"code": "authorization_header_missing",
                         "description":
                         "Authorization header is expected"}, 401)

    parts = auth.split()

    if parts[0].lower() != "bearer":
        raise AuthError({"code": "invalid_header",
                         "description":
                         "Authorization header must start with Bearer"}, 401)
    elif len(parts) == 1:
        raise AuthError({"code": "invalid_header",
                         "description": "Token not found"}, 401)
    elif len(parts) > 2:
        raise AuthError({"code": "invalid_header",
                         "description":
                         "Authorization header must be Bearer token"}, 401)

    token = parts[1]
    return token

def get_jwks():
    jwks_url = f'https://dev-fhx1orey2iklk5am.us.auth0.com/.well-known/jwks.json'
    return requests.get(jwks_url).json()

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_auth_header()
        try:
            jwks = get_jwks()
            unverified_header = jwt.get_unverified_header(token)
            rsa_key = {}
            for key in jwks["keys"]:
                if key["kid"] == unverified_header["kid"]:
                    rsa_key = {
                        "kty": key["kty"],
                        "kid": key["kid"],
                        "use": key["use"],
                        "n": key["n"],
                        "e": key["e"]
                    }
            if rsa_key:
                payload = jwt.decode(
                    token,
                    rsa_key,
                    algorithms=["RS256"],
                    audience='https://dev-fhx1orey2iklk5am.us.auth0.com/api/v2/',
                    issuer='https://dev-fhx1orey2iklk5am.us.auth0.com/'
                )
            else:
                raise AuthError({"code": "invalid_header",
                                 "description": "Unable to find appropriate key"}, 401)
        except JWTError:
            raise AuthError({"code": "invalid_header",
                             "description": "Invalid token"}, 401)
        
       
        user = User.query.filter_by(external_id=payload['sub']).first()
        if not user:
            raise AuthError({"code": "invalid_user",
                             "description": "User not found"}, 401)
        
        return f(user, *args, **kwargs)
    return decorated

def validate_user(user, user_id):
    """Validates that the authenticated user matches the requested user_id"""
    if str(user.id) != str(user_id):
        raise AuthError({"code": "unauthorized",
                         "description": "You are not authorized to access this resource"}, 403)




@app.route("/auth/register",methods=["POST"])
def signup():
    try:
        user_name = request.json.get("userName") 
        password = request.json.get("password")
        first_name = request.json.get("first_name")
        last_name = request.json.get("last_name")
        postal_code=request.json.get("postal_code")
        email=request.json.get("email")
        
        new_user = User.signup(username=user_name,password=password,first_name=first_name,last_name=last_name,postal_code=postal_code,email=email)
        db.session.commit()
        return jsonify({"message": "Success", "user": new_user.to_json()}), 201
        
    except Exception as e:
        return jsonify({"message":str(e)}),500
    
@app.route('/users', methods=["GET"])
def get_users():
    email=request.args.get("email")
    user = User.query.filter(User.email==email).first()
    print(user)
    if (user):
        return jsonify({"message": "Success", "user": user.to_json()}), 200
    else:
        return jsonify({"message": "Not Found"}), 404

@app.route("/users", methods=["POST"])
def create_user():
    external_id = request.json.get("external_id")
    email = request.json.get("email")
    given_name = request.json.get("given_name")
    family_name = request.json.get("family_name")

    new_user = User.addUser(external_id=external_id,email=email,given_name=given_name,family_name=family_name)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Success", "user": new_user.to_json()}), 201


@app.route("/stores",methods=["GET"])
@requires_auth
def get_stores(user):
    user_id = request.args.get('user_id')
    validate_user(user, user_id)
    try:
        stores = Store.query.filter(Store.user_id==user_id).all();
        json_stores = [store.to_json() for store in stores]
        return jsonify({"stores":json_stores})
    except Exception as e:
        return jsonify({"message":str(e)}),500
    
    
@app.route("/stores",methods=["POST"] )
@requires_auth
def add_store(user):
    try:
        user_id = request.json.get('user_id')
        store_data = request.json.get('storeData')
        store_name = store_data.get("storeName") 
        location = store_data.get("location")
        
        validate_user(user, user_id)
        new_store = Store(storename=store_name,location = location,user_id=user_id)
    
        db.session.add(new_store)
        db.session.commit()
        return jsonify({"message": "Success", "store": new_store.to_json()}), 201
    except Exception as e:
        db.session.rollback() 
        return jsonify({"message":str(e)},400)
    
    
@app.route("/stores/<int:storeId>",methods=["delete"])
@requires_auth
def delete_store(user, storeId):
    user_id = request.json.get('user_id')
    validate_user(user, user_id)
    try:
        store = Store.query.filter(Store.id == storeId).first()
        print(store.storename)
        
        db.session.delete(store)
        db.session.commit()
        
        return jsonify({"message": "Store deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": "Could not delete store", "message": str(e)}), 500
    
    
    
        
@app.route("/stores/<int:store_id>/items",methods=["GET"] )
@requires_auth
def getItems(user, store_id):
    user_id = request.args.get('user_id')
    try:
        validate_user(user, user_id)
        items = Item.query.filter_by(store_id=store_id).all()
        json_items = [item.to_json() for item in items]
        return jsonify({"items":json_items})
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    

    
@app.route("/stores/<int:store_id>/items",methods=["POST"] )
@requires_auth
def add_item(user, store_id):
    print(request.json)
    try:
        user_id = request.json.get('user_id')
        validate_user(user, user_id)
        
        item_data = request.json.get('item_data')
        print(item_data)
        itemname = item_data.get("itemName") 
        quantity = item_data.get("quantity")
        brand = item_data.get("brand")
        purpose = item_data.get("purpose")
        price = item_data.get("price")
        category_id = int(item_data.get("category"))
        
        print(request.json)
        
        new_item = Item(itemname=itemname,quantity = quantity, brand=brand, purpose=purpose,store_id=store_id,category_id=category_id,price=price)
        print(new_item)
        db.session.add(new_item)
        db.session.commit()
        return jsonify({"message": "Success", "item": new_item.to_json()}), 201
    except Exception as e:
        db.session.rollback() 
        return jsonify({"message":str(e)},400)
    
@app.route("/stores/<int:store_id>/items/<int:item_id>",methods=["DELETE"])
@requires_auth
def deleteItem(user, store_id,item_id):
    try:
        user_id = request.json.get('user_id')
        validate_user(user, user_id)
        item = Item.query.filter_by(id = item_id,store_id = store_id).first()
        if not item:
            return jsonify({"error": "Item not found"}), 404
        db.session.delete(item)
        db.session.commit()
        
        return jsonify({"message": "Item deleted successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": "Could not delete item", "message": str(e)}), 500
    

@app.route("/expenses",methods=["POST"])
@requires_auth
def add_expense(user):
    data = request.json.get('expense_data')
    user_id = request.json.get('user_id')
    try:
        validate_user(user, user_id)
        
        new_expense = Expense(
            date=data['date'],
            amount=int(data['amount']), 
            store_id=int(data['store_id'])  
        )
        
        db.session.add(new_expense)
        db.session.commit()
        return jsonify({"message": "Success", "expense": new_expense.to_json()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500
    
    
@app.route("/expenses",methods=["GET"])
@requires_auth
def get_expenses(user):
    user_id = request.args.get('user_id')
    print(user_id)
    try:
        validate_user(user, user_id)
        expenses = Expense.query.join(Store).filter(Store.user_id==user_id).all()
        json_expenses = [expense.to_json() for expense in expenses]
        print(json_expenses)
        return jsonify({"expenses":json_expenses})
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    

    
@app.route("/expenses/sum",methods=["GET"])
@requires_auth
def get_expense_sum(user):
    user_id = request.args.get('user_id')
    try:
        validate_user(user, user_id)
        time_frame = request.args.get("timeFrame")
        if time_frame not in time_frame_functions:
            return jsonify({"error": "Invalid time frame"}), 400
        
        sums = time_frame_functions[time_frame](user_id)
        sums_by_store = pie_chart_functions[time_frame](user_id)
        return jsonify({f"{time_frame.lower()}_sums": sums, f"{time_frame.lower()}_store_sums":sums_by_store})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
@app.route("/categories",methods=["GET"])
@requires_auth
def get_categories(user):
    user_id = request.args.get('user_id')
    validate_user(user, user_id)
    try:
        categories = Category.query.filter(Category.user_id == user_id).all()
        json_categories = [category.to_json() for category in categories]
        return jsonify({"categories":json_categories})
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    
@app.route("/categories",methods=["POST"])
@requires_auth
def add_category(user):
    try:
        user_id = request.json.get("user_id")
        data = request.json.get('categoryData')
        validate_user(user, user_id)
        
        category = data.get("categoryName")
        print(category)
        new_category = Category(category=category,user_id=user_id)
        db.session.add(new_category)
        db.session.commit()
        return jsonify({"message": "Success", "category": new_category.to_json()}), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    
@app.route("/categories/<int:category_id>",methods=["DELETE"])
@requires_auth
def deleteCategory(user, category_id):
    user_id = request.json.get('user_id')
    try:
        validate_user(user, user_id)
        category = category.query.filter_by(id = category_id).first()
        if not category:
            return jsonify({"error": "category not found"}), 404
        db.session.delete(category)
        db.session.commit()
        
        return jsonify({"message": "Item deleted successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": "Could not delete item", "message": str(e)}), 500
    
    
@app.route("/categories/<int:category_id>",methods=["PATCH"])
@requires_auth
def editCategory(user, category_id):
    data = request.json
    user_id = data["user_id"]
    validate_user(user, user_id)
    try:
        category = Category.query.filter(Category.user_id==user_id).filter(Category.id == category_id).first()
        print(category)
        if not category:
            return jsonify({"error": "category not found"}), 404
         
        if 'ordernumber' in data:
            category.ordernumber = data['ordernumber']
        
        
        db.session.commit()
        return jsonify({"message": "Category updated successfully", "category": category.to_json()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Could not update category", "message": str(e)}), 500
        
    

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    connect_db(app)
    app.run(host='0.0.0.0', port=port)