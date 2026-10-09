import { useEffect, useState } from "react";
import { request } from "../api";

const EMPTY_FORM = { name: "", species: "", breed: "", birthDate: "" };

// иконка по виду животного
const EMOJI = { кошка: "🐱", кот: "🐱", собака: "🐶", пёс: "🐶", попугай: "🦜", хомяк: "🐹", кролик: "🐰", рыбка: "🐠" };
const getEmoji = (species) => EMOJI[species.toLowerCase()] || "🐾";

// Вкладка «Питомцы». Владелец видит своих и может добавлять, администратор видит всех (с владельцем)
export default function PetsPage({ user }) {
    const isAdmin = user.role === "admin";

    const [pets, setPets] = useState([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null); // кого редактируем (null — добавляем нового)
    const [error, setError] = useState("");

    const loadPets = () => request("GET", "/pets").then(setPets);

    useEffect(() => {
        loadPets();
    }, []);

    // любое поле формы поменялось — обновляем его в form по имени поля (name="...")
    function handleChange(event) {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    function startEdit(pet) {
        setEditingId(pet.id);
        setForm({ name: pet.name, species: pet.species, breed: pet.breed || "", birthDate: pet.birthDate || "" });
        setError("");
    }

    function resetForm() {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setError("");
    }

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            if (editingId) {
                await request("PUT", `/pets/${editingId}`, form);
            } else {
                await request("POST", "/pets", form);
            }
            resetForm();
            loadPets();
        } catch (err) {
            setError(err.message);
        }
    }

    async function remove(id) {
        await request("DELETE", `/pets/${id}`);
        if (id === editingId) {
            resetForm();
        }
        loadPets();
    }

    // администратор своих питомцев не заводит — форма у него появляется только при изменении
    const showForm = !isAdmin || editingId;

    return (
        <section>
            <h2>{isAdmin ? "Все питомцы" : "Мои питомцы"}</h2>
            <ul>
                {pets.length === 0 && <li className="empty">Питомцев пока нет</li>}
                {pets.map((pet) => (
                    <li key={pet.id}>
                        <span className="emoji">{getEmoji(pet.species)}</span>
                        <div className="info">
                            <strong>{pet.name}</strong>
                            <small>{[pet.species, pet.breed, pet.birthDate].filter(Boolean).join(" · ")}</small>
                        </div>
                        {isAdmin && <span className="badge">👤 {pet.ownerLogin}</span>}
                        <button onClick={() => startEdit(pet)}>Изменить</button>
                        <button className="delete" onClick={() => remove(pet.id)}>Удалить</button>
                    </li>
                ))}
            </ul>

            {showForm && (
                <>
                    <h3>{editingId ? "Изменить питомца" : "Добавить питомца"}</h3>
                    <form className="grid" onSubmit={handleSubmit}>
                        <input name="name" placeholder="Кличка" value={form.name} onChange={handleChange} required />
                        <input name="species" placeholder="Вид (кошка, собака...)" value={form.species} onChange={handleChange} required />
                        <input name="breed" placeholder="Порода" value={form.breed} onChange={handleChange} />
                        <input name="birthDate" type="date" value={form.birthDate} onChange={handleChange} />
                        {error && <p className="error">{error}</p>}
                        <div className="form-buttons">
                            <button type="submit" className="primary">{editingId ? "Сохранить" : "Добавить"}</button>
                            {editingId && <button type="button" onClick={resetForm}>Отмена</button>}
                        </div>
                    </form>
                </>
            )}
        </section>
    );
}
