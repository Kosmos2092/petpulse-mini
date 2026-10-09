const { getDb } = require("../db/db");

// JOIN склеивает записи с питомцами и врачами, чтобы сразу отдать кличку и имя врача
const SELECT_WITH_NAMES = `
    SELECT appointments.id, appointments.date,
           pets.id AS petId, pets.name AS petName,
           vets.id AS vetId, vets.name AS vetName, vets.specialization
    FROM appointments
    JOIN pets ON pets.id = appointments.petId
    JOIN vets ON vets.id = appointments.vetId
`;

module.exports = {
    // все записи питомцев этого владельца, ближайшие сверху
    findAllByOwner: async (ownerId) =>
        await getDb().all(`${SELECT_WITH_NAMES} WHERE pets.ownerId = ? ORDER BY appointments.date`, ownerId),

    findById: async (id, ownerId) =>
        await getDb().get(`${SELECT_WITH_NAMES} WHERE appointments.id = ? AND pets.ownerId = ?`, id, ownerId),

    // занят ли врач в это время
    isSlotTaken: async (vetId, date) => {
        const row = await getDb().get("SELECT id FROM appointments WHERE vetId = ? AND date = ?", vetId, date);
        return Boolean(row);
    },

    create: async (petId, vetId, date) => {
        const result = await getDb().run("INSERT INTO appointments (petId, vetId, date) VALUES (?, ?, ?)", petId, vetId, date);
        return result.lastID;
    },

    remove: async (id) => await getDb().run("DELETE FROM appointments WHERE id = ?", id),
};
