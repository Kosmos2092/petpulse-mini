// Питомцы хранятся в обычном массиве в памяти сервера.
// После перезапуска сервера всё, что добавили через API, пропадает — остаются только эти два.
const pets = [
    { id: 1, name: "Барсик", species: "кошка", breed: "британская", birthDate: "2022-05-14" },
    { id: 2, name: "Рекс", species: "собака", breed: "овчарка", birthDate: "2020-03-01" },
];
let nextId = 3;

module.exports = {
    getPets: () => pets,

    getPetById: (id) => pets.find((pet) => pet.id === id),

    addPet: ({ name, species, breed, birthDate }) => {
        const pet = {
            id: nextId++,
            name,
            species,
            breed: breed || null,
            birthDate: birthDate || null,
        };
        pets.push(pet);
        return pet;
    },

    updatePet: (pet, { name, species, breed, birthDate }) => {
        pet.name = name;
        pet.species = species;
        pet.breed = breed || null;
        pet.birthDate = birthDate || null;
        return pet;
    },

    deletePet: (id) => {
        const index = pets.findIndex((pet) => pet.id === id);
        pets.splice(index, 1);
    },
};
