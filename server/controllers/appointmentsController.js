const appointmentsRepository = require("../repositories/appointmentsRepository");
const petsRepository = require("../repositories/petsRepository");
const vetsRepository = require("../repositories/vetsRepository");

// Владелец видит и отменяет только записи своих питомцев, администратор — все.

// GET /api/appointments — владельцу его записи, администратору все
const getAll = async (req, res) => {
    if (req.user.role === "admin") {
        return res.json(await appointmentsRepository.findAll());
    }

    res.json(await appointmentsRepository.findAllByOwner(req.user.id));
};

// POST /api/appointments — записать питомца к врачу
const create = async (req, res) => {
    const { date } = req.body;
    const petId = Number(req.body.petId);
    const vetId = Number(req.body.vetId);
    if (!petId || !vetId || !date) {
        return res.status(400).json({ message: "Нужно выбрать питомца, врача и время" });
    }

    if (new Date(date) < new Date()) {
        return res.status(400).json({ message: "Нельзя записаться на прошедшее время" });
    }

    const pet = await petsRepository.findById(petId);
    if (!pet || (req.user.role !== "admin" && pet.ownerId !== req.user.id)) {
        return res.status(404).json({ message: "Питомец не найден" });
    }

    if (!(await vetsRepository.findById(vetId))) {
        return res.status(404).json({ message: "Врач не найден" });
    }

    if (await appointmentsRepository.isSlotTaken(vetId, date)) {
        return res.status(409).json({ message: "Врач уже занят в это время, выберите другое" });
    }

    const id = await appointmentsRepository.create(petId, vetId, date);
    res.status(201).json(await appointmentsRepository.findById(id));
};

// DELETE /api/appointments/:id — отменить запись
const remove = async (req, res) => {
    const appointment = await appointmentsRepository.findById(Number(req.params.id));
    if (!appointment || (req.user.role !== "admin" && appointment.ownerId !== req.user.id)) {
        return res.status(404).json({ message: "Запись не найдена" });
    }

    await appointmentsRepository.remove(appointment.id);
    res.json({ message: "Запись отменена" });
};

module.exports = { getAll, create, remove };
