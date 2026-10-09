// Пропускает дальше только администратора. Ставится ПОСЛЕ checkAuth — тот уже положил req.user.
// 403 значит «ты вошёл, но тебе сюда нельзя» (в отличие от 401 — «ты не вошёл»).
const checkAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Доступно только администратору" });
    }

    next();
};

module.exports = checkAdmin;
