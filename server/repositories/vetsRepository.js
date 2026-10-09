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
};
