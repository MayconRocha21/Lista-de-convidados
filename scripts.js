document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('guestForm');
    const guestList = document.getElementById('guestList');
    const guestNameInput = document.getElementById('guestName');
    const guestCount = document.getElementById('guestCount');
    const errorMessage = document.getElementById('errorMessage');

    // Carregar convidados do localStorage
    loadGuests();

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const guestName = guestNameInput.value.trim();

        if (guestName !== '') {
            if (isDuplicate(guestName)) {
                showError('O nome já consta na lista');
            } else {
                addGuestToList(guestName);
                saveGuest(guestName);
                guestNameInput.value = '';
                guestNameInput.focus();
                hideError();
            }
        }
    });

    function addGuestToList(name) {
        const li = document.createElement('li');
        li.textContent = name;

        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.addEventListener('click', function() {
            const newName = prompt('Editar nome do convidado:', name);
            if (newName && newName.trim() !== '' && !isDuplicate(newName.trim())) {
                updateGuest(name, newName.trim());
                li.firstChild.textContent = newName.trim();
            } else if (isDuplicate(newName.trim())) {
                showError('O nome já consta na lista');
            }
        });

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remover';
        removeButton.addEventListener('click', function() {
            guestList.removeChild(li);
            removeGuest(name);
        });

        li.appendChild(editButton);
        li.appendChild(removeButton);
        guestList.appendChild(li);
        updateGuestCount();
    }

    function saveGuest(name) {
        let guests = getGuestsFromLocalStorage();
        guests.push(name);
        localStorage.setItem('guests', JSON.stringify(guests));
        updateGuestCount();
    }

    function removeGuest(name) {
        let guests = getGuestsFromLocalStorage();
        guests = guests.filter(guest => guest !== name);
        localStorage.setItem('guests', JSON.stringify(guests));
        updateGuestCount();
    }

    function updateGuest(oldName, newName) {
        let guests = getGuestsFromLocalStorage();
        const index = guests.indexOf(oldName);
        if (index !== -1) {
            guests[index] = newName;
            localStorage.setItem('guests', JSON.stringify(guests));
            updateGuestCount();
        }
    }

    function getGuestsFromLocalStorage() {
        const guests = localStorage.getItem('guests');
        return guests ? JSON.parse(guests) : [];
    }

    function loadGuests() {
        const guests = getGuestsFromLocalStorage();
        guests.forEach(addGuestToList);
        updateGuestCount();
    }

    function updateGuestCount() {
        const guests = getGuestsFromLocalStorage();
        guestCount.textContent = guests.length;
    }

    function isDuplicate(name) {
        const guests = getGuestsFromLocalStorage();
        return guests.includes(name);
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function hideError() {
        errorMessage.style.display = 'none';
    }
});
