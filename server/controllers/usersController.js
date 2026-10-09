const usersRepository = require("../repositories/usersRepository");

// GET /api/users — все пользователи (только администратор)
const getAll = async (req, res) => {
    res.json(await usersRepository.findAll());
};

// DELETE /api/users/:id — удалить пользователя вместе с его питомцами и записями (только администратор)
const remove = async (req, res) => {
    const user = await usersRepository.findById(Number(req.params.id));
    if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
    }

    if (user.id === req.user.id) {
        return res.status(400).json({ message: "Нельзя удалить самого себя" });
    }

    await usersRepository.remove(user.id);
    res.json({ message: "Пользователь удалён" });
};

module.exports = { getAll, remove };
