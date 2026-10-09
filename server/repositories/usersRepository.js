const { getDb } = require("../db/db");

// Репозиторий — функции с SQL-запросами к одной таблице. Остальной код с базой напрямую не работает.

module.exports = {
    // через регистрацию создаются только обычные пользователи (role = 'user')
    create: async (login, passwordHash) => {
        const result = await getDb().run("INSERT INTO users (login, password) VALUES (?, ?)", login, passwordHash);
        return { id: result.lastID, login, role: "user" };
    },

    // вместе с паролем — нужно для проверки при входе
    findByLogin: async (login) => await getDb().get("SELECT * FROM users WHERE login = ?", login),

    // без пароля — это отдаём клиенту
    findById: async (id) => await getDb().get("SELECT id, login, role FROM users WHERE id = ?", id),

    // все пользователи и сколько у каждого питомцев (для администратора)
    findAll: async () =>
        await getDb().all(`
            SELECT users.id, users.login, users.role, COUNT(pets.id) AS petsCount
            FROM users
            LEFT JOIN pets ON pets.ownerId = users.id
            GROUP BY users.id
            ORDER BY users.id
        `),

    // питомцы, записи и токены пользователя удалятся сами (ON DELETE CASCADE)
    remove: async (id) => await getDb().run("DELETE FROM users WHERE id = ?", id),
};
