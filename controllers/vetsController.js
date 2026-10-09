const { getVets, getVetById } = require("../data/vets");

// GET /vets — список врачей. Можно отфильтровать: GET /vets?specialization=терапевт
const getAll = (req, res) => {
    res.json(getVets(req.query.specialization));
};

// GET /vets/:id — один врач
const getOne = (req, res) => {
    const vet = getVetById(Number(req.params.id));
    if (!vet) {
        return res.status(404).json({ message: "Врач не найден" });
    }

    res.json(vet);
};

module.exports = { getAll, getOne };
