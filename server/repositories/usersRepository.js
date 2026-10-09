const { getDb } = require("../db/db");

// Репозиторий — функции с SQL-запросами к одной таблице. Остальной код с базой напрямую не работает.

module.exports = {
    create: async (login, passwordHash) => {
        const result = await getDb().run("INSERT INTO users (login, password) VALUES (?, ?)", login, passwordHash);
        return { id: result.lastID, login };
    },

    // вместе с паролем — нужно для проверки при входе
    findByLogin: async (login) => await getDb().get("SELECT * FROM users WHERE login = ?", login),

    // без пароля — это отдаём клиенту
    findById: async (id) => await getDb().get("SELECT id, login FROM users WHERE id = ?", id),
};
