import { useEffect, useState } from "react";
import { request } from "../api";
import { SPECIALIZATIONS } from "./VetsSection";

const EMPTY_FORM = { name: "", specialization: "", price: "" };

// Панель администратора: управление каталогом врачей
export default function AdminPanel() {
    const [vets, setVets] = useState([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [error, setError] = useState("");

    const loadVets = () => request("GET", "/vets").then(setVets);

    useEffect(() => {
        loadVets();
    }, []);

    function handleChange(event) {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            await request("POST", "/vets", form);
            setForm(EMPTY_FORM);
            setError("");
            loadVets();
        } catch (err) {
            setError(err.message);
        }
    }

    async function remove(id) {
        await request("DELETE", `/vets/${id}`);
        loadVets();
    }

    return (
        <section>
            <h2>Управление врачами</h2>
            <ul>
                {vets.length === 0 && <li className="empty">Врачей нет</li>}
                {vets.map((vet) => (
                    <li key={vet.id}>
                        <span className="emoji">🩺</span>
                        <div className="info">
                            <strong>{vet.name}</strong>
                            <small>{vet.specialization}</small>
                        </div>
                        <span className="price">{vet.price} ₽</span>
                        <button className="delete" onClick={() => remove(vet.id)}>Удалить</button>
                    </li>
                ))}
            </ul>

            <h3>Добавить врача</h3>
            <form className="grid" onSubmit={handleSubmit}>
                <input name="name" placeholder="ФИО" value={form.name} onChange={handleChange} required />
                <select name="specialization" value={form.specialization} onChange={handleChange} required>
                    <option value="">Специализация</option>
                    {SPECIALIZATIONS.map((item) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>
                <input name="price" type="number" min="1" placeholder="Цена приёма, ₽" value={form.price} onChange={handleChange} required />
                {error && <p className="error">{error}</p>}
                <div className="form-buttons">
                    <button type="submit" className="primary">Добавить</button>
                </div>
            </form>
        </section>
    );
}
