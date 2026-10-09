const petsRepository = require("../repositories/petsRepository");

// Контроллер — функции, которые обрабатывают запросы: проверяют данные,
// вызывают репозиторий и отправляют ответ. req.user кладёт middleware checkAuth.
// Владелец работает только со своими питомцами, администратор — со всеми.

// находит питомца по id из адреса, если он доступен: свой или пользователь — администратор
const findAccessiblePet = async (req) => {
    const pet = await petsRepository.findById(Number(req.params.id));
    if (pet && (req.user.role === "admin" || pet.ownerId === req.user.id)) {
        return pet;
    }
};

// GET /api/pets — владельцу его питомцы, администратору все
const getAll = async (req, res) => {
    if (req.user.role === "admin") {
        return res.json(await petsRepository.findAll());
    }

    res.json(await petsRepository.findAllByOwner(req.user.id));
};

// GET /api/pets/:id — один питомец
const getOne = async (req, res) => {
    const pet = await findAccessiblePet(req);
    if (!pet) {
        return res.status(404).json({ message: "Питомец не найден" });
    }

    res.json(pet);
};

// POST /api/pets — добавить питомца (владельцем становится тот, кто добавил)
const create = async (req, res) => {
    const { name, species } = req.body;
    if (!name || !species) {
        return res.status(400).json({ message: "Нужно указать кличку и вид" });
    }

    const newPet = await petsRepository.create(req.user.id, req.body);
    res.status(201).json(newPet);
};

// PUT /api/pets/:id — изменить питомца
const update = async (req, res) => {
    const pet = await findAccessiblePet(req);
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
    const pet = await findAccessiblePet(req);
    if (!pet) {
        return res.status(404).json({ message: "Питомец не найден" });
    }

    await petsRepository.remove(pet.id);
    res.json({ message: "Питомец удалён" });
};

module.exports = { getAll, getOne, create, update, remove };
