import { useState } from "react";
import { request } from "../api";

const EMPTY_FORM = { petId: "", vetId: "", date: "" };

// "2027-01-15T10:00" → "15 янв. 2027 г., 10:00"
const formatDate = (date) => new Date(date).toLocaleString("ru-RU", { dateStyle: "medium", timeStyle: "short" });

// Записи к врачу + форма записи
export default function AppointmentsSection({ appointments, pets, vets, onChange }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [error, setError] = useState("");

    function handleChange(event) {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            await request("POST", "/appointments", form);
            setForm(EMPTY_FORM);
            setError("");
            onChange();
        } catch (err) {
            setError(err.message); // например, «Врач уже занят в это время»
        }
    }

    async function cancel(id) {
        await request("DELETE", `/appointments/${id}`);
        onChange();
    }

    return (
        <section>
            <h2>Записи к врачу</h2>
            <ul>
                {appointments.length === 0 && <li className="empty">Записей пока нет</li>}
                {appointments.map((item) => (
                    <li key={item.id}>
                        <span className="emoji">📅</span>
                        <div className="info">
                            <strong>{item.petName} → {item.vetName}</strong>
                            <small>{item.specialization} · {formatDate(item.date)}</small>
                        </div>
                        <button className="delete" onClick={() => cancel(item.id)}>Отменить</button>
                    </li>
                ))}
            </ul>

            <h3>Записаться на приём</h3>
            {pets.length === 0 ? (
                <p className="empty">Сначала добавьте питомца</p>
            ) : (
                <form className="grid" onSubmit={handleSubmit}>
                    <select name="petId" value={form.petId} onChange={handleChange} required>
                        <option value="">Питомец</option>
                        {pets.map((pet) => (
                            <option key={pet.id} value={pet.id}>{pet.name}</option>
                        ))}
                    </select>
                    <select name="vetId" value={form.vetId} onChange={handleChange} required>
                        <option value="">Врач</option>
                        {vets.map((vet) => (
                            <option key={vet.id} value={vet.id}>{vet.name} — {vet.specialization}</option>
                        ))}
                    </select>
                    <input name="date" type="datetime-local" value={form.date} onChange={handleChange} required />
                    {error && <p className="error">{error}</p>}
                    <div className="form-buttons">
                        <button type="submit" className="primary">Записаться</button>
                    </div>
                </form>
            )}
        </section>
    );
}
