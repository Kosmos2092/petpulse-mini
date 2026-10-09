const express = require("express");
const cookieParser = require("cookie-parser");
const { initDb } = require("./db/db");
const authRouter = require("./routes/auth");
const petsRouter = require("./routes/pets");
const vetsRouter = require("./routes/vets");
const appointmentsRouter = require("./routes/appointments");
const usersRouter = require("./routes/users");

const app = express();

// чтобы тело запроса в формате JSON превращалось в объект req.body
app.use(express.json());

// чтобы cookie из запроса были доступны в req.cookies (там лежит токен входа)
app.use(cookieParser());

app.get("/api", (req, res) => {
    res.json({ message: "PetPulse mini API работает" });
});

app.use("/api/auth", authRouter);
app.use("/api/pets", petsRouter);
app.use("/api/vets", vetsRouter);
app.use("/api/appointments", appointmentsRouter);
app.use("/api/users", usersRouter);

// сюда попадают запросы на адреса, которых нет выше
app.use((req, res) => {
    res.status(404).json({ message: "Такого адреса нет" });
});

// сюда попадают ошибки, возникшие в обработчиках (например, сломанный JSON в запросе)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: "Ошибка на сервере" });
});

const port = process.env.PORT || 3001;

// сначала подключаемся к базе, потом запускаем сервер
initDb().then(() => {
    app.listen(port, () => {
        console.log(`Сервер запущен: http://localhost:${port}`);
    });
});
