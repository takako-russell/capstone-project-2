## Project Description

This app helps users create shopping lists assigned to multiple stores. Users can add and delete stores. Items can be added to a list by filling out input fields for item name, brand, quantity, purpose, categories, and price. Users can sort items in "Manage Categories," where they can numerically order the categories. By manipulating the categories, users can set the order based on the store layout, reducing the need to backtrack in the store. After shopping, users also have the option to add the expense at the store, which can be viewed in "Expense Details." Users can choose from weekly, monthly, and yearly spending lists, which include the display of average expenses for these time frames in a pie chart.

## Tech Stack

- Python
- Flask
- sqlalchemy
- React
- Ant Design
- Postgres

## Setup instruction

For local setup:

1. Clone repository
2. Create a postgres database with `$ createdb shopping_list `
3. Backend: navigate to /<root>/backend

   1. Create vertual environment with

      `$ python3 -m venv .venv`

      `$ source .venv/bin/activate`

   2. run `$ pip install -r requirements.txt` from root directory of repository
   3. type `python3 main.py` to run the app
   4. Once complete, the API layer will run by default on `http://localhost:5000`

4. Frontend: navigate to /<root>/frontend

   1. Install node dependencies with

      `$ npm install`

   2. This project uses vite run scripts with react, consult the `package.json` for run scripts
      - by default use `npm run dev` to build and run
      - the frontend will run by default on `http://localhost:5173`

Authentication/Authorization:

1. The application is built with Auth0 SDK and expects a Client-Id/key, Domain and Audience values supplied.
2. These values have been placed in the `/<root>/src/Auth0ProviderWithHistory.jsx` file.
   1. For demo purposes these CAN be used, but minimally. Ideally, create a free Auth0 dev tenant. Create a new Application of type Web App, and find these values in the configuration UI w/in Auth0.
   2. Create a `.env` file in the root and consume these values in your `Auth0ProiderWithHistory.jsx`

The login/signup flow will proceed when navigating to the web-app root. If properly configured, the application will use the Auth0 SDK to forward the user from home to the subdomain at Auth0, activating an OIDC authentication flow.
The user should create credentials or leverage Social Auth (such as sign-in with Google). Once authorized the user is redirected to the home page, credentials are validated, and additionally the provided access token is henceforth used for the API (backend) layer.
The user will then quietly be redirected to the in-app landing page where they may create/manage stores, items, categories.

From an authorization perspective, nearly all API endpoints require two details 1) the access token (sent in Authorization header) is valid, 2) the user ID for the operation is the same user ID in the access token. This is facilitated by matching the token's `sid` (Auth0 ID) to the persisted user's `externalId` in the /Users table of the postgres database. Once this lookup is successful, the user (local to our database) ID is forwarded with all requests and the access token.
ß
