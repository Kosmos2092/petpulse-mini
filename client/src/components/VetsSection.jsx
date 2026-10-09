import { useEffect, useState } from "react";
import { request } from "../api";

// список специализаций — используется и в фильтре, и в панели администратора
export const SPECIALIZATIONS = ["терапевт", "хирург", "дерматолог", "офтальмолог", "стоматолог"];

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
                    </li>
                ))}
            </ul>
        </section>
    );
}
