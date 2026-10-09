const express = require("express");
const cors = require("cors");
const petsRouter = require("./routes/pets");
const vetsRouter = require("./routes/vets");

const app = express();

// чтобы тело POST/PUT-запроса в формате JSON превращалось в объект req.body
app.use(express.json());

// разрешаем запросы со страницы клиента: она открыта с другого адреса, и без этого браузер их заблокирует
app.use(cors());

app.get("/", (req, res) => {
    res.json({ message: "PetPulse mini API работает" });
});

app.use("/pets", petsRouter);
app.use("/vets", vetsRouter);

// сюда попадают запросы на адреса, которых нет выше
app.use((req, res) => {
    res.status(404).json({ message: "Такого адреса нет" });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Сервер запущен: http://localhost:${port}`);
});
