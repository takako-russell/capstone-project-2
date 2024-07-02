from flask import jsonify,request
from config import app
from models import connect_db, User,Store,Item,Expense,db


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


@app.route("/stores",methods=["GET"])
def get_stores():
    print('stores')
    try:
        stores = Store.query.all()
        json_stores = [store.to_json() for store in stores]
        return jsonify({"stores":json_stores})
    except Exception as e:
        return jsonify({"message":str(e)}),500
    

@app.route("/stores",methods=["POST"] )
def add_store():
    print(request.json)
    try:
        store_name = request.json.get("storeName") 
        location = request.json.get("location")
        
        new_store = Store(storename=store_name,location = location)
    
        db.session.add(new_store)
        db.session.commit()
        return jsonify({"message": "Success", "store": new_store.to_json()}), 201
    except Exception as e:
        db.session.rollback() 
        return jsonify({"message":str(e)},400)
    
    
@app.route("/stores/<int:storeId>",methods=["delete"])
def delete_store(storeId):
    print(storeId)
    try:
        store = Store.query.filter(Store.id == storeId).first()
        print(store.storename)
        
        db.session.delete(store)
        db.session.commit()
        
        return jsonify({"message": "Store deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": "Could not delete store", "message": str(e)}), 500
    
    
    # TODO: This is the original return.  May want to return with the created object but not required (see above)
    # return jsonify({"message":"Successfully added!"},201)
        
        
@app.route("/stores/<int:store_id>/items",methods=["GET"] )
def getItems(store_id):
    try:
        items = Item.query.filter_by(store_id=store_id).all()
        json_items = [item.to_json() for item in items]
        return jsonify({"items":json_items})
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    
@app.route("/stores/<int:store_id>/items/<int:item_id>")
def getItem(store_id,item_id):
    store = Store.query.get(id=store_id)
    if not store:
        return jsonify({"error": "Store not found"}), 404

    item = Item.query.filter_by(id = item_id,store_id = store_id)
    if not item:
        return jsonify({"error": "Item not found"}), 404
    
@app.route("/stores/<int:store_id>/items",methods=["POST"] )
def add_item(store_id):
    try:
        itemname = request.json.get("itemName") 
        quantity = request.json.get("quantity")
        brand = request.json.get("brand")
        purpose = request.json.get("purpose")
        
        new_item = Item(itemname=itemname,quantity = quantity, brand=brand, purpose=purpose,store_id=store_id)
    
        db.session.add(new_item)
        db.session.commit()
        return jsonify({"message": "Success", "item": new_item.to_json()}), 201
    except Exception as e:
        db.session.rollback() 
        return jsonify({"message":str(e)},400)
    
@app.route("/stores/<int:store_id>/items/<int:item_id>",methods=["DELETE"])
def deleteItem(store_id,item_id):
    try:
        item = Item.query.filter_by(id = item_id,store_id = store_id).first()
        if not item:
            return jsonify({"error": "Item not found"}), 404
        db.session.delete(item)
        db.session.commit()
        
        return jsonify({"message": "Item deleted successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": "Could not delete item", "message": str(e)}), 500
    

@app.route("/expenses",methods=["POST"])
def add_expense():
    try:
        print(request.json)
        date = request.json.get("date")
        amount = request.json.get("amount")
        
        new_expense = Expense(date=date,amount=amount)
        
        db.session.add(new_expense)
        db.session.commit()
        return jsonify({"message": "Success", "expense": new_expense.to_json()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500
    
    
@app.route("/expenses",methods=["GET"])
def get_expenses():
    try:
        expenses = Expense.query.all()
        json_expenses = [expense.to_json() for expense in expenses]
        return jsonify({"expenses":json_expenses})
    except Exception as e:
        return jsonify({"message": str(e)}), 500

if __name__ == "__main__":
    print('main')
    connect_db(app)
    with app.app_context():
        print('main2')
        db.create_all()
        
    app.run(debug=True)