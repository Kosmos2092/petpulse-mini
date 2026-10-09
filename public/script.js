// Страницу отдаёт тот же сервер, поэтому адрес сервера писать не нужно — просто "/pets"

const petsList = document.getElementById("pets-list");
const petForm = document.getElementById("pet-form");
const vetsList = document.getElementById("vets-list");
const vetFilter = document.getElementById("vet-filter");

// GET /pets — загрузить питомцев и показать списком
async function loadPets() {
    const response = await fetch("/pets");
    const pets = await response.json();

    petsList.innerHTML = ""; // очищаем старый список
    for (const pet of pets) {
        const text = document.createElement("span");
        text.textContent = `${pet.name} — ${pet.species}${pet.breed ? ", " + pet.breed : ""}`;

        const editButton = document.createElement("button");
        editButton.textContent = "Изменить";
        editButton.onclick = () => editPet(pet);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Удалить";
        deleteButton.onclick = () => deletePet(pet.id);

        const li = document.createElement("li");
        li.append(text, editButton, deleteButton);
        petsList.append(li);
    }
}

// POST /pets — добавить питомца из формы
petForm.onsubmit = async (event) => {
    event.preventDefault(); // чтобы страница не перезагружалась

    const newPet = {
        name: document.getElementById("name").value,
        species: document.getElementById("species").value,
        breed: document.getElementById("breed").value,
        birthDate: document.getElementById("birthDate").value,
    };

    const response = await fetch("/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPet),
    });

    if (!response.ok) {
        const error = await response.json();
        alert(error.message);
        return;
    }

    petForm.reset(); // очищаем поля формы
    loadPets();
};

// PUT /pets/:id — изменить кличку
async function editPet(pet) {
    const name = prompt("Новая кличка:", pet.name);
    if (!name) {
        return; // нажали «Отмена» или оставили пустым
    }

    await fetch(`/pets/${pet.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name,
            species: pet.species,
            breed: pet.breed,
            birthDate: pet.birthDate,
        }),
    });
    loadPets();
}

// DELETE /pets/:id — удалить питомца
async function deletePet(id) {
    await fetch(`/pets/${id}`, { method: "DELETE" });
    loadPets();
}

// GET /vets — загрузить врачей (с фильтром, если он выбран)
async function loadVets() {
    let url = "/vets";
    if (vetFilter.value) {
        url += "?specialization=" + vetFilter.value;
    }

    const response = await fetch(url);
    const vets = await response.json();

    vetsList.innerHTML = "";
    for (const vet of vets) {
        const li = document.createElement("li");
        li.textContent = `${vet.name} — ${vet.specialization}, ${vet.price} ₽`;
        vetsList.append(li);
    }
}

// при смене фильтра заново загружаем врачей
vetFilter.onchange = loadVets;

// при открытии страницы сразу загружаем данные
loadPets();
loadVets();
