import { useEffect, useState } from "react";
import { request } from "../api";

// Вкладка «Пользователи» (только администратор): список и удаление
export default function UsersPage({ user }) {
    const [users, setUsers] = useState([]);

    const loadUsers = () => request("GET", "/users").then(setUsers);

    useEffect(() => {
        loadUsers();
    }, []);

    async function remove(id) {
        await request("DELETE", `/users/${id}`);
        loadUsers();
    }

    return (
        <section>
            <h2>Пользователи</h2>
            <ul>
                {users.map((item) => (
                    <li key={item.id}>
                        <span className="emoji">{item.role === "admin" ? "🛡️" : "👤"}</span>
                        <div className="info">
                            <strong>{item.login}</strong>
                            <small>{item.role === "admin" ? "администратор" : `владелец · питомцев: ${item.petsCount}`}</small>
                        </div>
                        {item.id !== user.id && (
                            <button className="delete" onClick={() => remove(item.id)}>Удалить</button>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    );
}
