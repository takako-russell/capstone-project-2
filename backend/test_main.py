import pytest
from unittest.mock import patch
from main import app, AuthError, requires_auth, get_token_auth_header, get_jwks
from models import db, User, Category,Store,Item, Expense
from jose import jwt

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/test_db'
    client = app.test_client()

    with app.app_context():
        db.create_all()

    yield client

    with app.app_context():
        db.drop_all()

@pytest.fixture
def mock_auth():
    def mock_get_token_auth_header():
        return "mocked_token"

    def mock_get_jwks():
        return {
            "keys": [
                {
                    "kid": "mocked_kid",
                    "kty": "RSA",
                    "use": "sig",
                    "n": "mocked_n",
                    "e": "mocked_e"
                }
            ]
        }

    def mock_jwt_decode(*args, **kwargs):
        return {"sub": "test_user_id"}

    with patch('main.get_token_auth_header', mock_get_token_auth_header), \
         patch('main.get_jwks', mock_get_jwks), \
         patch('jose.jwt.decode', mock_jwt_decode), \
         patch('jose.jwt.get_unverified_header', return_value={"kid": "mocked_kid"}):
        yield

@pytest.fixture
def test_user(client):
    with app.app_context():
        user = User(external_id='test_user_id', email='test@example.com')
        db.session.add(user)
        db.session.commit()
        return user.id
    
@pytest.fixture
def test_store(client, test_user):
    with app.app_context():
        store = Store(storename="Test Store", location="Test Location", user_id=test_user)
        db.session.add(store)
        db.session.commit()
        return store.id
    
@pytest.fixture
def test_category(client, test_user):
    with app.app_context():
        category = Category(category="Test Category", user_id=test_user)
        db.session.add(category)
        db.session.commit()
        return category.id


@pytest.mark.usefixtures("mock_auth")
def test_get_categories(client, test_user):
    response = client.get(f'/categories?user_id={test_user}')
    assert response.status_code == 200
    assert 'categories' in response.json

@pytest.mark.usefixtures("mock_auth")
def test_add_category(client, test_user):
    response = client.post('/categories', json={
        "user_id": test_user,
        "categoryData": {"categoryName": "New Category"}
    })
    assert response.status_code == 201
    assert response.json['category']['category'] == "New Category"
    
@pytest.mark.usefixtures("mock_auth")
def test_get_stores(client, test_user):
    response = client.get(f'/stores?user_id={test_user}')
    assert response.status_code == 200
    assert 'stores' in response.json


@pytest.mark.usefixtures("mock_auth")
def test_get_items(client, test_user, test_store):
    response = client.get(f'/stores/{test_store}/items?user_id={test_user}')
    assert response.status_code == 200
    assert 'items' in response.json


@pytest.mark.usefixtures("mock_auth")
def test_get_expenses(client, test_user):
    response = client.get(f'/expenses?user_id={test_user}')
    assert response.status_code == 200
    assert 'expenses' in response.json

@pytest.mark.usefixtures("mock_auth")
def test_add_item(client, test_user, test_store, test_category):
    response = client.post(f'/stores/{test_store}/items', json={
        "user_id": test_user,
        "item_data": {
            "itemName": "New Item",
            "quantity": 1,
            "brand": "Test Brand",
            "purpose": "Test Purpose",
            "price": 9.99,
            "category": test_category
        }
    })
    
    assert response.status_code == 201, f"Expected status code 201, but got {response.status_code}"
    assert 'item' in response.json, f"Expected 'item' in response, but got: {response.json}"
    