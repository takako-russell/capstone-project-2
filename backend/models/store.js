class Store {
  static async registerStore({ storename, location }) {
    const duplicateCheck = await db.query(
      `SELECT storename
               FROM stores
               WHERE storename = $1`,
      [storename]
    );

    if (duplicateCheck.rows[0]) {
      throw new Error(`Duplicate storename: ${storename}`);
    }

    const result = await db.query(
      `INSERT INTO stores
               (storeName,
                location)
               VALUES ($1, $2)
               RETURNING storeName,location`[(storename, location)]
    );

    const store = result.rows[0];

    return store;
  }
}
