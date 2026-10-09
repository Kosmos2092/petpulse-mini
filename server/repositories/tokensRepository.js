const crypto = require("crypto");
const { getDb } = require("../db/db");

// Токен — случайная строка, которую сервер выдаёт при входе и кладёт в cookie.
// По нему сервер узнаёт пользователя в следующих запросах.

module.exports = {
    create: async (userId) => {
        const token = crypto.randomUUID();
        await getDb().run("INSERT INTO tokens (token, userId) VALUES (?, ?)", token, userId);
        return token;
    },

    findUserId: async (token) => {
        const row = await getDb().get("SELECT userId FROM tokens WHERE token = ?", token);
        return row?.userId;
    },

    remove: async (token) => await getDb().run("DELETE FROM tokens WHERE token = ?", token),
};
