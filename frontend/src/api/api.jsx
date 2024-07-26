import axios from "axios";

const BASE_URL = process.env.BACKEND_URL || "http://localhost:5000";
const token = null;

class ShoppingApi {
  static token;

  static async request(endpoint, data = {}, method = "get") {
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${ShoppingApi.getToken()}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      if (err.response) {
        if (err.response.status == "404") {
          return "NOT_FOUND";
        }
        console.error("API Error:", err.response.data);
        throw new Error(
          `API Error: ${err.response.status} - ${
            err.response.data.message || err.response.data.error
          }`
        );
      } else if (err.request) {
        console.error("Network Error:", err.request);
        throw new Error("Network Error: No response received from the server.");
      } else {
        console.error("Error:", err.message);
        throw new Error(`Error: ${err.message}`);
      }
    }
  }

  static setToken(token) {
    ShoppingApi.token = token;
  }

  static getToken() {
    return this.token;
  }

  static async getAuthdUser(email) {
    try {
      let res = await this.request("users", { email: email }, "get");

      return res.user;
    } catch (ex) {
      if (ex == "NOT_FOUND") {
        return null;
      }
    }
    return null;
  }

  static async createNewAuthdUser(user) {
    console.log(user);
    const userPayload = {
      external_id: user.sub,
      email: user.email,
      family_name: user.family_name,
      given_name: user.given_name,
    };

    let res = await this.request("users", userPayload, "post");
  }

  static async getStores(userId) {
    let res = await this.request("stores", { user_id: userId });
    return res.stores;
  }

  static async createStore(userId, storeData) {
    let res = await this.request(
      "stores",
      { user_id: userId, storeData },
      "post"
    );

    return res.store;
  }

  static async deleteStore(userId, storeId) {
    let res = await this.request(
      `stores/${storeId}`,
      { user_id: userId },
      "delete"
    );
    return res.message;
  }

  static async getItems(userId, storeId) {
    let res = await this.request(`stores/${storeId}/items`, {
      user_id: userId,
    });
    return res.items;
  }

  static async addItem(userId, storeId, itemData) {
    let res = await this.request(
      `stores/${storeId}/items`,
      { user_id: userId, item_data: itemData },
      "post"
    );
    return res.item;
  }

  static async deleteItem(userId, storeId, itemId) {
    let res = await this.request(
      `stores/${storeId}/items/${itemId}`,
      { user_id: userId },
      "delete"
    );
    return res.message;
  }

  static async addExpense(userId, expenseData) {
    let res = await this.request(
      "expenses",
      { user_id: userId, expense_data: expenseData },
      "post"
    );
    return res.expense;
  }

  static async getAllExpenses(userId) {
    let res = await this.request("expenses", { user_id: userId });
    return res.expenses;
  }

  static async getExpenseSum(userId, timeFrame) {
    let res = await this.request(`expenses/sum?timeFrame=${timeFrame}`, {
      user_id: userId,
    });
    return res;
  }

  static async getCategories(userId) {
    let res = await this.request("categories", { user_id: userId }, "get");

    return res.categories;
  }

  static async addCategory(userId, categoryData) {
    let res = await this.request(
      "categories",
      { user_id: userId, categoryData: categoryData },
      "post"
    );
    return res.category;
  }

  static async deletecategory(userId, categoryId) {
    let res = await this.request(
      `categories/${categoryId}`,
      { user_id: userId, categoryId },
      "delete"
    );
    return res.message;
  }

  static async updateCategoryOrder(userId, categoryId, orderNumber) {
    let res = await this.request(
      `categories/${categoryId}`,
      { user_id: userId, ordernumber: orderNumber },
      "PATCH"
    );
    return res.category;
  }
}

export default ShoppingApi;
