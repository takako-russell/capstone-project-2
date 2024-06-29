import axios from "axios";

// const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";
const BASE_URL = "http://localhost:5000";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class ShoppingApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${ShoppingApi.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      // throw new Error(err.message);
      if (err.response) {
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
    // return JoblyApi.token == null
    //   ? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ" +
    //       "SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0." +
    //       "FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc"
    //   : JoblyApi.token;
  }

  // Individual API routes

  /** Get details on a company by handle. */

  static async getStores() {
    let res = await this.request("stores");
    console.log(res);
    return res.stores;
  }

  static async createStore(storeData) {
    let res = await this.request("stores", storeData, "post");
    console.log(res);
    // TODO: Actually check res[0], res[1] etc for status code, message. Then return the best response
    if (res[1] != 201) {
      //handle errors
    }
    return res.store;
  }

  static async deleteStore(storeId) {
    console.log("deleting store: ", storeId);
    let res = await this.request(`stores/${storeId}`, {}, "delete");
    return res.message;
  }

  static async addItem(storeId, itemData) {
    console.log("api.addItem itemData:", itemData);
    let res = await this.request(`stores/${storeId}/items`, itemData, "post");
    console.log(res);
    return res.item;
  }

  static async getItems(storeId) {
    let res = await this.request(`stores/${storeId}/items`);
    console.log("items from db:", res);
    const items = res.items.map((item) => ({
      itemName: item.itemname,
      quantity: item.quantity,
      purpose: item.purpose,
    }));
    console.log("get items:", res.items);
    return res.items;
  }

  static async getItem(storeId, itemId) {
    let res = await this.request(`stores/${storeId}/items/${itemId}`);
    console.log(res);
    return res.item;
  }

  static async deleteItem(storeId, itemId) {
    let res = await this.request(
      `stores/${storeId}/items/${itemId}`,
      {},
      "delete"
    );
    return res.message;
  }

  static async addExpense(expenseData) {
    let res = await this.request("expenses", expenseData, "post");
    return res.expense;
  }

  // TODO: REMOVE BELOW BUT USE AS REFERENCE

  // static async signup(data) {
  //   let res = await this.request("auth/register", data, "post");
  //   return res.token;
  // }

  // static async login(data) {
  //   let res = await this.request(`auth/token`, data, "post");
  //   return res.token;
  // }

  // static async getCurrUser(username) {
  //   let res = await this.request(`users/${username}`);
  //   return res.user;
  // }
}
export default ShoppingApi;

ShoppingApi.token = null;
