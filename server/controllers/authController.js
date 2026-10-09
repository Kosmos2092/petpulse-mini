const crypto = require("crypto");
const usersRepository = require("../repositories/usersRepository");
const tokensRepository = require("../repositories/tokensRepository");

const COOKIE_NAME = "token";

// пароль храним не в открытом виде, а в виде хеша
const hashPassword = (password) => crypto.createHash("sha256").update(password).digest("hex");

// создаёт токен и кладёт его в cookie — после этого пользователь считается вошедшим
const logIn = async (res, userId) => {
    const token = await tokensRepository.create(userId);
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true, // cookie недоступна из JavaScript на странице
        maxAge: 24 * 60 * 60 * 1000, // живёт сутки
    });
};

// POST /api/auth/register — регистрация (и сразу вход)
const register = async (req, res) => {
    const { login, password } = req.body;
    if (!login || !password) {
        return res.status(400).json({ message: "Нужно указать логин и пароль" });
    }

    if (password.length < 4) {
        return res.status(400).json({ message: "Пароль должен быть не короче 4 символов" });
    }

    if (await usersRepository.findByLogin(login)) {
        return res.status(409).json({ message: "Такой логин уже занят" });
    }

    const user = await usersRepository.create(login, hashPassword(password));
    await logIn(res, user.id);
    res.status(201).json(user);
};

// POST /api/auth/login — вход
const login = async (req, res) => {
    const { login, password } = req.body;
    if (!login || !password) {
        return res.status(400).json({ message: "Нужно указать логин и пароль" });
    }

    const user = await usersRepository.findByLogin(login);
    if (!user || user.password !== hashPassword(password)) {
        return res.status(401).json({ message: "Неверный логин или пароль" });
    }

    await logIn(res, user.id);
    res.json({ id: user.id, login: user.login });
};

// POST /api/auth/logout — выход: удаляем токен из базы и cookie
const logout = async (req, res) => {
    await tokensRepository.remove(req.cookies.token);
    res.clearCookie(COOKIE_NAME);
    res.json({ message: "Вы вышли из системы" });
};

// GET /api/auth/me — кто сейчас вошёл
const me = async (req, res) => {
    res.json(await usersRepository.findById(req.userId));
};

module.exports = { register, login, logout, me };
