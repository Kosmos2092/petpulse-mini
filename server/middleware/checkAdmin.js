const usersRepository = require("../repositories/usersRepository");

// Пропускает дальше только администратора. Ставится ПОСЛЕ checkAuth — тот уже положил req.userId.
// 403 значит «ты вошёл, но тебе сюда нельзя» (в отличие от 401 — «ты не вошёл»).
const checkAdmin = async (req, res, next) => {
    const user = await usersRepository.findById(req.userId);
    if (user.role !== "admin") {
        return res.status(403).json({ message: "Доступно только администратору" });
    }

    next();
};

module.exports = checkAdmin;
