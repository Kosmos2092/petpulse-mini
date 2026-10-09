const { getDb } = require("../db/db");

// к питомцу сразу добавляем логин владельца — администратору нужно видеть, чей это питомец
const SELECT_WITH_OWNER = `
    SELECT pets.*, users.login AS ownerLogin
    FROM pets
    JOIN users ON users.id = pets.ownerId
`;

module.exports = {
    // все питомцы (для администратора)
    findAll: async () => await getDb().all(`${SELECT_WITH_OWNER} ORDER BY pets.id`),

    // питомцы одного владельца
    findAllByOwner: async (ownerId) => await getDb().all(`${SELECT_WITH_OWNER} WHERE pets.ownerId = ? ORDER BY pets.id`, ownerId),

    findById: async (id) => await getDb().get(`${SELECT_WITH_OWNER} WHERE pets.id = ?`, id),

    create: async (ownerId, { name, species, breed, birthDate }) => {
        const result = await getDb().run(
            "INSERT INTO pets (ownerId, name, species, breed, birthDate) VALUES (?, ?, ?, ?, ?)",
            ownerId, name, species, breed || null, birthDate || null
        );
        return await getDb().get(`${SELECT_WITH_OWNER} WHERE pets.id = ?`, result.lastID);
    },

    update: async (id, { name, species, breed, birthDate }) => {
        await getDb().run(
            "UPDATE pets SET name = ?, species = ?, breed = ?, birthDate = ? WHERE id = ?",
            name, species, breed || null, birthDate || null, id
        );
        return await getDb().get(`${SELECT_WITH_OWNER} WHERE pets.id = ?`, id);
    },

    // записи питомца на приём удалятся сами (ON DELETE CASCADE в таблице appointments)
    remove: async (id) => await getDb().run("DELETE FROM pets WHERE id = ?", id),
};
