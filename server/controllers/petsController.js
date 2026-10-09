const { getPets, getPetById, addPet, updatePet, deletePet } = require("../data/pets");

// Контроллер — функции, которые обрабатывают запросы: проверяют данные,
// вызывают функции из data и отправляют ответ.

// GET /pets — все питомцы
const getAll = (req, res) => {
    res.json(getPets());
};

// GET /pets/:id — один питомец
const getOne = (req, res) => {
    const pet = getPetById(Number(req.params.id));
    if (!pet) {
        return res.status(404).json({ message: "Питомец не найден" });
    }

    res.json(pet);
};

// POST /pets — добавить питомца
const create = (req, res) => {
    const { name, species } = req.body;
    if (!name || !species) {
        return res.status(400).json({ message: "Нужно указать name и species" });
    }

    const newPet = addPet(req.body);
    res.status(201).json(newPet);
};

// PUT /pets/:id — изменить данные питомца
const update = (req, res) => {
    const pet = getPetById(Number(req.params.id));
    if (!pet) {
        return res.status(404).json({ message: "Питомец не найден" });
    }

    const { name, species } = req.body;
    if (!name || !species) {
        return res.status(400).json({ message: "Нужно указать name и species" });
    }

    res.json(updatePet(pet, req.body));
};

// DELETE /pets/:id — удалить питомца
const remove = (req, res) => {
    const pet = getPetById(Number(req.params.id));
    if (!pet) {
        return res.status(404).json({ message: "Питомец не найден" });
    }

    deletePet(pet.id);
    res.json({ message: "Питомец удалён" });
};

module.exports = { getAll, getOne, create, update, remove };
