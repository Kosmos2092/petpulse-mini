// Страницу отдаёт тот же сервер, поэтому адрес сервера писать не нужно — просто "/pets"

const petsList = document.getElementById("pets-list");
const petForm = document.getElementById("pet-form");
const formTitle = document.getElementById("form-title");
const submitButton = document.getElementById("submit-button");
const cancelButton = document.getElementById("cancel-button");
const vetsList = document.getElementById("vets-list");
const vetFilter = document.getElementById("vet-filter");

// id питомца, которого сейчас редактируем. null — значит форма добавляет нового
let editingId = null;

// иконка по виду животного
const EMOJI = { кошка: "🐱", кот: "🐱", собака: "🐶", пёс: "🐶", попугай: "🦜", хомяк: "🐹", кролик: "🐰", рыбка: "🐠" };
const getEmoji = (species) => EMOJI[species.toLowerCase()] || "🐾";

// GET /pets — загрузить питомцев и показать списком
async function loadPets() {
    const response = await fetch("/pets");
    const pets = await response.json();

    petsList.innerHTML = ""; // очищаем старый список
    if (pets.length === 0) {
        petsList.innerHTML = '<li class="empty">Пока нет питомцев</li>';
        return;
    }

    for (const pet of pets) {
        const emoji = document.createElement("span");
        emoji.className = "emoji";
        emoji.textContent = getEmoji(pet.species);

        const name = document.createElement("strong");
        name.textContent = pet.name;

        // вид, порода, дата рождения через точку; пустые убираем
        const details = document.createElement("small");
        details.textContent = [pet.species, pet.breed, pet.birthDate].filter(Boolean).join(" · ");

        const info = document.createElement("div");
        info.className = "info";
        info.append(name, details);

        const editButton = document.createElement("button");
        editButton.textContent = "Изменить";
        editButton.onclick = () => startEdit(pet);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete";
        deleteButton.textContent = "Удалить";
        deleteButton.onclick = () => deletePet(pet.id);

        const li = document.createElement("li");
        li.append(emoji, info, editButton, deleteButton);
        petsList.append(li);
    }
}

// «Изменить»: подставляем данные питомца в форму и переключаем её в режим редактирования
function startEdit(pet) {
    editingId = pet.id;
    document.getElementById("name").value = pet.name;
    document.getElementById("species").value = pet.species;
    document.getElementById("breed").value = pet.breed || "";
    document.getElementById("birthDate").value = pet.birthDate || "";

    formTitle.textContent = `Изменить: ${pet.name}`;
    submitButton.textContent = "Сохранить";
    cancelButton.hidden = false;
    petForm.scrollIntoView({ behavior: "smooth" });
}

// возвращаем форму в режим добавления
function resetForm() {
    editingId = null;
    petForm.reset();
    formTitle.textContent = "Добавить питомца";
    submitButton.textContent = "Добавить";
    cancelButton.hidden = true;
}

cancelButton.onclick = resetForm;

// Отправка формы: POST /pets (добавить) или PUT /pets/:id (изменить)
petForm.onsubmit = async (event) => {
    event.preventDefault(); // чтобы страница не перезагружалась

    const pet = {
        name: document.getElementById("name").value,
        species: document.getElementById("species").value,
        breed: document.getElementById("breed").value,
        birthDate: document.getElementById("birthDate").value,
    };

    const url = editingId ? `/pets/${editingId}` : "/pets";
    const method = editingId ? "PUT" : "POST";

    const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pet),
    });

    if (!response.ok) {
        const error = await response.json();
        alert(error.message);
        return;
    }

    resetForm();
    loadPets();
};

// DELETE /pets/:id — удалить питомца
async function deletePet(id) {
    await fetch(`/pets/${id}`, { method: "DELETE" });
    if (id === editingId) {
        resetForm(); // удалили того, кого редактировали
    }
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
        const emoji = document.createElement("span");
        emoji.className = "emoji";
        emoji.textContent = "🩺";

        const name = document.createElement("strong");
        name.textContent = vet.name;

        const specialization = document.createElement("small");
        specialization.textContent = vet.specialization;

        const info = document.createElement("div");
        info.className = "info";
        info.append(name, specialization);

        const price = document.createElement("span");
        price.className = "price";
        price.textContent = `${vet.price} ₽`;

        const li = document.createElement("li");
        li.append(emoji, info, price);
        vetsList.append(li);
    }
}

// при смене фильтра заново загружаем врачей
vetFilter.onchange = loadVets;

// при открытии страницы сразу загружаем данные
loadPets();
loadVets();
