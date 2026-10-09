const { getDb } = require("../db/db");

module.exports = {
    // если специализация не указана — отдаём всех врачей
    findAll: async (specialization) => {
        if (!specialization) {
            return await getDb().all("SELECT * FROM vets");
        }
        return await getDb().all("SELECT * FROM vets WHERE specialization = ?", specialization);
    },

    findById: async (id) => await getDb().get("SELECT * FROM vets WHERE id = ?", id),

    create: async (name, specialization, price) => {
        const result = await getDb().run(
            "INSERT INTO vets (name, specialization, price) VALUES (?, ?, ?)",
            name, specialization, price
        );
        return await getDb().get("SELECT * FROM vets WHERE id = ?", result.lastID);
    },

    // записи к этому врачу удалятся сами (ON DELETE CASCADE в таблице appointments)
    remove: async (id) => await getDb().run("DELETE FROM vets WHERE id = ?", id),
};
