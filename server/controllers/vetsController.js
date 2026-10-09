const vetsRepository = require("../repositories/vetsRepository");

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
    const { name, specialization } = req.body;
    const price = Number(req.body.price);
    if (!name || !specialization || !(price > 0)) {
        return res.status(400).json({ message: "Нужно указать ФИО, специализацию и цену больше 0" });
    }

    const newVet = await vetsRepository.create(name, specialization, price);
    res.status(201).json(newVet);
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

module.exports = { getAll, getOne, create, remove };
