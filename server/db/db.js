const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

let db;

// Открывает базу (файл database.db рядом с этим файлом) и создаёт таблицы, если их ещё нет
const initDb = async () => {
    db = await open({
        filename: path.join(__dirname, "database.db"),
        driver: sqlite3.Database,
    });

    // по умолчанию SQLite не проверяет связи между таблицами — включаем
    await db.exec("PRAGMA foreign_keys = ON");

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            login TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS tokens (
            token TEXT PRIMARY KEY,
            userId INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS vets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            specialization TEXT NOT NULL,
            price INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS pets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ownerId INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            species TEXT NOT NULL,
            breed TEXT,
            birthDate TEXT
        );

        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            petId INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
            vetId INTEGER NOT NULL REFERENCES vets(id),
            date TEXT NOT NULL
        );
    `);

    // врачей заводит клиника, через API они не создаются — добавляем при первом запуске
    const { count } = await db.get("SELECT COUNT(*) AS count FROM vets");
    if (count === 0) {
        await db.exec(`
            INSERT INTO vets (name, specialization, price) VALUES
                ('Иванова Анна Сергеевна', 'терапевт', 1500),
                ('Петров Максим Олегович', 'хирург', 2500),
                ('Смирнова Елена Викторовна', 'дерматолог', 1800),
                ('Кузнецов Дмитрий Андреевич', 'терапевт', 1500)
        `);
    }
};

const getDb = () => db;

module.exports = { initDb, getDb };
