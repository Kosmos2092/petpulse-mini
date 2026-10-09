// Врачей заводит клиника, поэтому через API они не создаются — список задан заранее.
const vets = [
    { id: 1, name: "Иванова Анна Сергеевна", specialization: "терапевт", price: 1500 },
    { id: 2, name: "Петров Максим Олегович", specialization: "хирург", price: 2500 },
    { id: 3, name: "Смирнова Елена Викторовна", specialization: "дерматолог", price: 1800 },
    { id: 4, name: "Кузнецов Дмитрий Андреевич", specialization: "терапевт", price: 1500 },
];

module.exports = {
    // если специализация не указана — отдаём всех врачей
    getVets: (specialization) => {
        if (!specialization) {
            return vets;
        }
        return vets.filter((vet) => vet.specialization === specialization);
    },
    getVetById: (id) => vets.find((vet) => vet.id === id),
};
