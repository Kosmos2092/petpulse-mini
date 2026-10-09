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

module.exports = { getAll, getOne };
