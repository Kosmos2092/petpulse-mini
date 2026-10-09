import { useEffect, useState } from "react";
import { request } from "../api";

// Каталог врачей с фильтром по специализации
export default function VetsSection() {
    const [vets, setVets] = useState([]);
    const [specialization, setSpecialization] = useState("");

    // загружаем врачей при открытии и при каждой смене фильтра
    useEffect(() => {
        const query = specialization ? `?specialization=${specialization}` : "";
        request("GET", `/vets${query}`).then(setVets);
    }, [specialization]);

    return (
        <section>
            <div className="section-header">
                <h2>Ветеринарные врачи</h2>
                <select value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
                    <option value="">Все специализации</option>
                    <option value="терапевт">Терапевт</option>
                    <option value="хирург">Хирург</option>
                    <option value="дерматолог">Дерматолог</option>
                </select>
            </div>
            <ul>
                {vets.map((vet) => (
                    <li key={vet.id}>
                        <span className="emoji">🩺</span>
                        <div className="info">
                            <strong>{vet.name}</strong>
                            <small>{vet.specialization}</small>
                        </div>
                        <span className="price">{vet.price} ₽</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
