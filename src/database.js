import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf-8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        fs.writeFile(databasePath, JSON.stringify({}));
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table, search) {
    let data = this.#database[table] ?? [];
    const { name, email } = search;

    if (name != undefined && email != undefined) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].includes(value);
        });
      });
    }

    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();
  }

  update(table, id, data) {
    const dataIndex = this.#database[table].findIndex(
      (index) => index.id === id
    );

    if (dataIndex > -1) {
      this.#database[table][dataIndex] = { id, ...data };
      this.#persist();
    }
  }

  delete(table, id) {
    const dataIndex = this.#database[table].findIndex(
      (index) => index.id === id
    );

    if (dataIndex > -1) {
      this.#database[table].splice(dataIndex, 1);
      this.#persist();
    }
  }
}
