const vetsRepository = require("../repositories/vetsRepository");

// проверка данных врача для добавления и изменения; возвращает текст ошибки или null
const validateVet = ({ name, specialization, price }) => {
    if (!name || !specialization || !(Number(price) > 0)) {
        return "Нужно указать ФИО, специализацию и цену больше 0";
    }
    return null;
};

// GET /api/vets — список врачей. Можно отфильтровать: /api/vets?specialization=терапевт
const getAll = async (req, res) => {
    res.json(await vetsRepository.findAll(req.query.specialization));
};

// GET /api/vets/:id — один врач
const getOne = async (req, res) => {
    const vet = await vetsRepository.findById(Number(req.params.id));
    if (!vet) {
        return res.status(404).json({ message: "Врач не найден" });
    }

    res.json(vet);
};

// POST /api/vets — добавить врача (только администратор)
const create = async (req, res) => {
    const error = validateVet(req.body);
    if (error) {
        return res.status(400).json({ message: error });
    }

    const { name, specialization, price } = req.body;
    const newVet = await vetsRepository.create(name, specialization, Number(price));
    res.status(201).json(newVet);
};

// PUT /api/vets/:id — изменить врача (только администратор)
const update = async (req, res) => {
    const vet = await vetsRepository.findById(Number(req.params.id));
    if (!vet) {
        return res.status(404).json({ message: "Врач не найден" });
    }

    const error = validateVet(req.body);
    if (error) {
        return res.status(400).json({ message: error });
    }

    const { name, specialization, price } = req.body;
    res.json(await vetsRepository.update(vet.id, name, specialization, Number(price)));
};

// DELETE /api/vets/:id — удалить врача (только администратор)
const remove = async (req, res) => {
    const vet = await vetsRepository.findById(Number(req.params.id));
    if (!vet) {
        return res.status(404).json({ message: "Врач не найден" });
    }

    await vetsRepository.remove(vet.id);
    res.json({ message: "Врач удалён" });
};

module.exports = { getAll, getOne, create, update, remove };
