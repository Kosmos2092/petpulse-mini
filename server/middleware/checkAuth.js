const tokensRepository = require("../repositories/tokensRepository");

// Middleware — функция, которая выполняется ДО контроллера.
// Проверяет, что пользователь вошёл: берёт токен из cookie и ищет его в базе.
// Если вошёл — кладёт id пользователя в req.userId и пропускает дальше, если нет — отвечает 401.
const checkAuth = async (req, res, next) => {
    const token = req.cookies.token;
    const userId = token && (await tokensRepository.findUserId(token));
    if (!userId) {
        return res.status(401).json({ message: "Нужно войти в систему" });
    }

    req.userId = userId;
    next();
};

module.exports = checkAuth;
