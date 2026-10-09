const { getDb } = require("../db/db");

module.exports = {
    findAllByOwner: async (ownerId) => await getDb().all("SELECT * FROM pets WHERE ownerId = ?", ownerId),

    // ищем только среди питомцев этого владельца, чтобы чужих не было видно
    findById: async (id, ownerId) => await getDb().get("SELECT * FROM pets WHERE id = ? AND ownerId = ?", id, ownerId),

    create: async (ownerId, { name, species, breed, birthDate }) => {
        const result = await getDb().run(
            "INSERT INTO pets (ownerId, name, species, breed, birthDate) VALUES (?, ?, ?, ?, ?)",
            ownerId, name, species, breed || null, birthDate || null
        );
        return await getDb().get("SELECT * FROM pets WHERE id = ?", result.lastID);
    },

    update: async (id, { name, species, breed, birthDate }) => {
        await getDb().run(
            "UPDATE pets SET name = ?, species = ?, breed = ?, birthDate = ? WHERE id = ?",
            name, species, breed || null, birthDate || null, id
        );
        return await getDb().get("SELECT * FROM pets WHERE id = ?", id);
    },

    // записи питомца на приём удалятся сами (ON DELETE CASCADE в таблице appointments)
    remove: async (id) => await getDb().run("DELETE FROM pets WHERE id = ?", id),
};
