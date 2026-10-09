import { useEffect, useState } from "react";
import { request } from "../api";
import PetsSection from "./PetsSection";
import AppointmentsSection from "./AppointmentsSection";
import VetsSection from "./VetsSection";

// Главный экран вошедшего пользователя. Здесь хранятся данные, которые нужны нескольким блокам
export default function Dashboard() {
    const [pets, setPets] = useState([]);
    const [vets, setVets] = useState([]);
    const [appointments, setAppointments] = useState([]);

    const loadPets = () => request("GET", "/pets").then(setPets);
    const loadAppointments = () => request("GET", "/appointments").then(setAppointments);

    // при открытии экрана загружаем всё
    useEffect(() => {
        loadPets();
        loadAppointments();
        request("GET", "/vets").then(setVets);
    }, []);

    // после изменения питомцев обновляем и записи: при удалении питомца удаляются его записи
    function handlePetsChange() {
        loadPets();
        loadAppointments();
    }

    return (
        <>
            <PetsSection pets={pets} onChange={handlePetsChange} />
            <AppointmentsSection appointments={appointments} pets={pets} vets={vets} onChange={loadAppointments} />
            <VetsSection />
        </>
    );
}
