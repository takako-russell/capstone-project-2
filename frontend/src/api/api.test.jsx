import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";
import ShoppingApi from "./api";

vi.mock("axios");

describe("ShoppingApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ShoppingApi.setToken("test-token");
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("successfully makes a GET request", async () => {
    const mockResponse = { data: { message: "Success" } };
    axios.mockResolvedValue(mockResponse);

    const result = await ShoppingApi.request("test-endpoint");

    expect(axios).toHaveBeenCalledWith({
      url: expect.stringContaining("/test-endpoint"),
      method: "get",
      data: {},
      params: {},
      headers: { Authorization: "Bearer test-token" },
    });
    expect(result).toEqual(mockResponse.data);
  });

  it("handles API errors", async () => {
    const mockError = {
      response: {
        status: 400,
        data: { message: "Bad Request" },
      },
    };
    axios.mockRejectedValue(mockError);

    await expect(ShoppingApi.request("test-endpoint")).rejects.toThrow(
      "API Error: 400 - Bad Request"
    );
  });

  it("gets authenticated user", async () => {
    const mockUser = { id: 1, email: "test@example.com" };
    axios.mockResolvedValue({ data: { user: mockUser } });

    const result = await ShoppingApi.getAuthdUser("test@example.com");

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining("/users"),
        method: "get",
        params: { email: "test@example.com" },
      })
    );
    expect(result).toEqual(mockUser);
  });

  it("creates a new authenticated user", async () => {
    const mockUser = {
      sub: "123",
      email: "new@example.com",
      family_name: "Doe",
      given_name: "John",
    };
    const mockResponse = { user: { id: 1, ...mockUser } };
    axios.mockResolvedValue({ data: mockResponse });

    const result = await ShoppingApi.createNewAuthdUser(mockUser);

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining("/users"),
        method: "post",
        data: expect.objectContaining({
          external_id: "123",
          email: "new@example.com",
          family_name: "Doe",
          given_name: "John",
        }),
      })
    );
    expect(result).toEqual(mockResponse.user);
  });

  it("gets stores for a user", async () => {
    const mockStores = [
      { id: 1, name: "Store 1" },
      { id: 2, name: "Store 2" },
    ];
    axios.mockResolvedValue({ data: { stores: mockStores } });

    const result = await ShoppingApi.getStores("user1");

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining("/stores"),
        method: "get",
        params: { user_id: "user1" },
      })
    );
    expect(result).toEqual(mockStores);
  });

  it("creates a new store", async () => {
    const mockStore = { id: 1, name: "New Store" };
    axios.mockResolvedValue({ data: { store: mockStore } });

    const result = await ShoppingApi.createStore("user1", {
      name: "New Store",
    });

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining("/stores"),
        method: "post",
        data: { user_id: "user1", storeData: { name: "New Store" } },
      })
    );
    expect(result).toEqual(mockStore);
  });

  it("deletes a store", async () => {
    axios.mockResolvedValue({ data: { message: "Store deleted" } });

    const result = await ShoppingApi.deleteStore("user1", "store1");

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining("/stores/store1"),
        method: "delete",
        data: { user_id: "user1" },
      })
    );
    expect(result).toEqual("Store deleted");
  });

  it("gets items for a store", async () => {
    const mockItems = [
      { id: 1, name: "Item 1" },
      { id: 2, name: "Item 2" },
    ];
    axios.mockResolvedValue({ data: { items: mockItems } });

    const result = await ShoppingApi.getItems("user1", "store1");

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining("/stores/store1/items"),
        method: "get",
        params: { user_id: "user1" },
      })
    );
    expect(result).toEqual(mockItems);
  });

  it("adds a new item to a store", async () => {
    const mockItem = { id: 1, name: "New Item" };
    axios.mockResolvedValue({ data: { item: mockItem } });

    const result = await ShoppingApi.addItem("user1", "store1", {
      name: "New Item",
    });

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining("/stores/store1/items"),
        method: "post",
        data: { user_id: "user1", item_data: { name: "New Item" } },
      })
    );
    expect(result).toEqual(mockItem);
  });

  it("deletes an item from a store", async () => {
    axios.mockResolvedValue({ data: { message: "Item deleted" } });

    const result = await ShoppingApi.deleteItem("user1", "store1", "item1");

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining("/stores/store1/items/item1"),
        method: "delete",
        data: { user_id: "user1" },
      })
    );
    expect(result).toEqual("Item deleted");
  });
});
