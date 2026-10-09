import { useEffect, useState } from "react";
import { request } from "../api";

// список специализаций — для фильтра и для формы администратора
const SPECIALIZATIONS = ["терапевт", "хирург", "дерматолог", "офтальмолог", "стоматолог"];

const EMPTY_FORM = { name: "", specialization: "", price: "" };

// Вкладка «Врачи». Каталог с фильтром видят все, администратор ещё добавляет, меняет и удаляет врачей
export default function VetsPage({ user }) {
    const isAdmin = user?.role === "admin"; // у гостя user = null, поэтому «?.»

    const [vets, setVets] = useState([]);
    const [specialization, setSpecialization] = useState("");
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    const loadVets = () => {
        const query = specialization ? `?specialization=${specialization}` : "";
        return request("GET", `/vets${query}`).then(setVets);
    };

    // загружаем врачей при открытии и при каждой смене фильтра
    useEffect(() => {
        loadVets();
    }, [specialization]);

    function handleChange(event) {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    function startEdit(vet) {
        setEditingId(vet.id);
        setForm({ name: vet.name, specialization: vet.specialization, price: vet.price });
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
                await request("PUT", `/vets/${editingId}`, form);
            } else {
                await request("POST", "/vets", form);
            }
            resetForm();
            loadVets();
        } catch (err) {
            setError(err.message);
        }
    }

    async function remove(id) {
        await request("DELETE", `/vets/${id}`);
        if (id === editingId) {
            resetForm();
        }
        loadVets();
    }

    return (
        <section>
            <div className="section-header">
                <h2>Ветеринарные врачи</h2>
                <select value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
                    <option value="">Все специализации</option>
                    {SPECIALIZATIONS.map((item) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>
            </div>
            <ul>
                {vets.length === 0 && <li className="empty">Врачей с такой специализацией нет</li>}
                {vets.map((vet) => (
                    <li key={vet.id}>
                        <span className="emoji">🩺</span>
                        <div className="info">
                            <strong>{vet.name}</strong>
                            <small>{vet.specialization}</small>
                        </div>
                        <span className="price">{vet.price} ₽</span>
                        {isAdmin && (
                            <>
                                <button onClick={() => startEdit(vet)}>Изменить</button>
                                <button className="delete" onClick={() => remove(vet.id)}>Удалить</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>

            {isAdmin && (
                <>
                    <h3>{editingId ? "Изменить врача" : "Добавить врача"}</h3>
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
                            <button type="submit" className="primary">{editingId ? "Сохранить" : "Добавить"}</button>
                            {editingId && <button type="button" onClick={resetForm}>Отмена</button>}
                        </div>
                    </form>
                </>
            )}
        </section>
    );
}
