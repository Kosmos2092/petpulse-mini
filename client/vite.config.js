import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite — инструмент, который запускает React-приложение в режиме разработки
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        open: true, // сам откроет браузер
        // запросы на /api клиент отправляет «себе», а Vite пересылает их на сервер (порт 3001)
        proxy: {
            "/api": "http://localhost:3001",
        },
    },
});
