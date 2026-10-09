import { useState } from "react";
import { request } from "../api";

// Форма входа и регистрации. После успеха передаёт пользователя наверх через onLogin
export default function AuthForm({ onLogin }) {
    const [mode, setMode] = useState("login"); // "login" — вход, "register" — регистрация
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const isLogin = mode === "login";

    async function handleSubmit(event) {
        event.preventDefault(); // чтобы страница не перезагружалась
        try {
            // POST /api/auth/login или POST /api/auth/register
            const user = await request("POST", `/auth/${mode}`, { login, password });
            onLogin(user);
        } catch (err) {
            setError(err.message);
        }
    }

    function switchMode() {
        setMode(isLogin ? "register" : "login");
        setError("");
    }

    return (
        <section className="auth">
            <h2>{isLogin ? "Вход" : "Регистрация"}</h2>
            <form className="column" onSubmit={handleSubmit}>
                <input placeholder="Логин" value={login} onChange={(e) => setLogin(e.target.value)} required />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="error">{error}</p>}
                <button type="submit" className="primary">
                    {isLogin ? "Войти" : "Зарегистрироваться"}
                </button>
            </form>
            <p className="switch">
                {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
                <button className="link" onClick={switchMode}>
                    {isLogin ? "Зарегистрироваться" : "Войти"}
                </button>
            </p>
        </section>
    );
}
