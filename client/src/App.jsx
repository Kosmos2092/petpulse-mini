import { useEffect, useState } from "react";
import { request } from "./api";
import AuthForm from "./components/AuthForm";
import PetsPage from "./pages/PetsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import VetsPage from "./pages/VetsPage";
import UsersPage from "./pages/UsersPage";

// какие вкладки видит каждая роль
const TABS = {
    guest: [
        { id: "login", title: "Вход" },
        { id: "vets", title: "Врачи" },
    ],
    user: [
        { id: "pets", title: "Мои питомцы" },
        { id: "appointments", title: "Записи к врачу" },
        { id: "vets", title: "Врачи" },
    ],
    admin: [
        { id: "pets", title: "Все питомцы" },
        { id: "appointments", title: "Все записи" },
        { id: "vets", title: "Врачи" },
        { id: "users", title: "Пользователи" },
    ],
};

export default function App() {
    const [user, setUser] = useState(null); // кто вошёл (null — гость)
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("");

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

    const role = user ? user.role : "guest";
    const tabs = TABS[role];
    // если выбранной вкладки у этой роли нет (например, сразу после входа или выхода) — открываем первую
    const currentTab = tabs.some((item) => item.id === tab) ? tab : tabs[0].id;

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

            <main>
                <nav className="tabs">
                    {tabs.map((item) => (
                        <button
                            key={item.id}
                            className={item.id === currentTab ? "active" : ""}
                            onClick={() => setTab(item.id)}
                        >
                            {item.title}
                        </button>
                    ))}
                </nav>

                {currentTab === "login" && <AuthForm onLogin={setUser} />}
                {currentTab === "pets" && <PetsPage user={user} />}
                {currentTab === "appointments" && <AppointmentsPage user={user} />}
                {currentTab === "vets" && <VetsPage user={user} />}
                {currentTab === "users" && <UsersPage user={user} />}
            </main>
        </>
    );
}
