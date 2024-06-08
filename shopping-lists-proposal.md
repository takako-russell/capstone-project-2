# Shopping Lists - Project Proposal

### Intro:

The Shopping List app is designed to help users create and manage shopping lists for individual stores, catering to those who shop at multiple locations for specific items. Users can set default items for each store, eliminating the need to repeatedly add frequently purchased items. Additionally, the app allows users to manually add, edit, and delete items from their lists.

### Sections:

1. [Dabase Design](#database-design)
2. [Internal API](#internal-api) (no third party API used)
3. [User Flows](#user-flows)
4. [Technical Details](#technical-details)
5. [User Data and AuthN/AuthZ](#user-data-and-authnauthz)

## Database Design

This project will utilize Postgres w/ a relational database. Tables will include
Users,Stores,items

## Internal API

The following operations are possible:

1. Signup / Login: user credentials hashed encoded w/ bcrypt
   1. /signup (POST)
   2. /login (POST)
2. Users: show and manage user profile
   1. /users/<userId> (GET) - Show user profile
   2. /users/<userId> (PUT) - Update user profile
   3. /users/<userId> (DELETE) - Delete user profile
3. Stores: Show and manage stores
   1. /stores (GET) - show the list of stores
   2. /stores/<storeId> (PUT) - Update the store profile
   3. /stores/<storeId> (GET) - Store details
   4. /stores/<storeId> (POST) - Create a store profile
   5. /stores/<storeId> (DELETE) - Remove a store
4. Items: Add,edit and delete items
   1. /stores/<storeId>/items (GET) - Show a list of items
   2. /stores/<storeId>/items/<itemId> (PUT) - Edit item
   3. /stores/<storeId>/items/<itemId> (DELETE) - Remove item

## User Flows

The following options describe user interaction with this application:

1. (Route: /) Home page describes the app and prompts for registration. The login button is also visible in the navigation.
2. Regsiter/Login with a username and password
3. Once registered/logged in, the session is updated to check authorization and continued session auth.
4. Logged in users can view all the added stores on the post-login screen.
5. Here, a user can either add a new store or check the list of items by clicking on a store name.
6. Adding a new store will require the name of the store and its location.
7. Items can be added on the store page by inputting the name of the item, quantity, and optionally the pourpose. They can be editted or removed from the list.

## Technical Details

- Database - Postgres Relational DB
- Server - Python, Flask, SQLAlchemy
- Client - HTML with Jinja for server side view logic, React,CSS

## User data and AuthN/AuthZ

When users login, encryption of password is handled by bcrypt and password is stored hashed and encrypted. Authorization is only handled by session token.
