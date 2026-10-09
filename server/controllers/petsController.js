const petsRepository = require("../repositories/petsRepository");

// Контроллер — функции, которые обрабатывают запросы: проверяют данные,
// вызывают репозиторий и отправляют ответ. req.userId кладёт middleware checkAuth.

// GET /api/pets — мои питомцы
const getAll = async (req, res) => {
    res.json(await petsRepository.findAllByOwner(req.userId));
};

// GET /api/pets/:id — один мой питомец
const getOne = async (req, res) => {
    const pet = await petsRepository.findById(Number(req.params.id), req.userId);
    if (!pet) {
        return res.status(404).json({ message: "Питомец не найден" });
    }

    res.json(pet);
};

// POST /api/pets — добавить питомца
const create = async (req, res) => {
    const { name, species } = req.body;
    if (!name || !species) {
        return res.status(400).json({ message: "Нужно указать кличку и вид" });
    }

    const newPet = await petsRepository.create(req.userId, req.body);
    res.status(201).json(newPet);
};

// PUT /api/pets/:id — изменить питомца
const update = async (req, res) => {
    const pet = await petsRepository.findById(Number(req.params.id), req.userId);
    if (!pet) {
        return res.status(404).json({ message: "Питомец не найден" });
    }

    const { name, species } = req.body;
    if (!name || !species) {
        return res.status(400).json({ message: "Нужно указать кличку и вид" });
    }

    res.json(await petsRepository.update(pet.id, req.body));
};

// DELETE /api/pets/:id — удалить питомца (вместе с его записями к врачу)
const remove = async (req, res) => {
    const pet = await petsRepository.findById(Number(req.params.id), req.userId);
    if (!pet) {
        return res.status(404).json({ message: "Питомец не найден" });
    }

    await petsRepository.remove(pet.id);
    res.json({ message: "Питомец удалён" });
};

module.exports = { getAll, getOne, create, update, remove };
