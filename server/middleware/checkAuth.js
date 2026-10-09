const tokensRepository = require("../repositories/tokensRepository");
const usersRepository = require("../repositories/usersRepository");

// Middleware — функция, которая выполняется ДО контроллера.
// Проверяет, что пользователь вошёл: берёт токен из cookie и ищет его в базе.
// Если вошёл — кладёт пользователя в req.user ({ id, login, role }) и пропускает дальше, если нет — отвечает 401.
const checkAuth = async (req, res, next) => {
    const token = req.cookies.token;
    const userId = token && (await tokensRepository.findUserId(token));
    const user = userId && (await usersRepository.findById(userId));
    if (!user) {
        return res.status(401).json({ message: "Нужно войти в систему" });
    }

    req.user = user;
    next();
};

module.exports = checkAuth;
