import { useEffect, useState } from "react";
import { request } from "./api";
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";

export default function App() {
    const [user, setUser] = useState(null); // кто вошёл (null — никто)
    const [loading, setLoading] = useState(true);

    // при открытии страницы спрашиваем сервер: пользователь уже вошёл?
    useEffect(() => {
        request("GET", "/auth/me")
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    async function logout() {
        await request("POST", "/auth/logout");
        setUser(null);
    }

    if (loading) {
        return null;
    }

    return (
        <>
            <header>
                <h1>🐾 PetPulse mini</h1>
                <p>Учёт питомцев и запись к ветеринару</p>
                {user && (
                    <div className="user-bar">
                        👤 {user.login}
                        <button onClick={logout}>Выйти</button>
                    </div>
                )}
            </header>

            <main>{user ? <Dashboard /> : <AuthForm onLogin={setUser} />}</main>
        </>
    );
}
