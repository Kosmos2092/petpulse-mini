import { useEffect, useState } from "react";
import { request } from "./api";
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";
import VetsSection from "./components/VetsSection";

export default function App() {
    const [user, setUser] = useState(null); // кто вошёл (null — гость)
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

    // что показывать: гостю — вход и каталог врачей, админу — панель управления, владельцу — его кабинет
    let content;
    if (!user) {
        content = (
            <>
                <AuthForm onLogin={setUser} />
                <VetsSection />
            </>
        );
    } else if (user.role === "admin") {
        content = <AdminPanel />;
    } else {
        content = <Dashboard />;
    }

    return (
        <>
            <header>
                <h1>🐾 PetPulse mini</h1>
                <p>Учёт питомцев и запись к ветеринару</p>
                {user && (
                    <div className="user-bar">
                        {user.role === "admin" ? "🛡️" : "👤"} {user.login}
                        {user.role === "admin" && " (администратор)"}
                        <button onClick={logout}>Выйти</button>
                    </div>
                )}
            </header>

            <main>{content}</main>
        </>
    );
}
