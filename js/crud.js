const API = 'http://127.0.0.1:3000/items';

document.addEventListener('DOMContentLoaded', init);

function init() {
    loadItems();

    document.getElementById('form')
        .addEventListener('submit', addItem);
}

async function loadItems() {
    const list = document.getElementById('list');

    list.innerHTML = 'Завантаження...';

    try {
        const response = await fetch(API);
        const items = await response.json();

        if (items.length === 0) {
            list.innerHTML = 'Список порожній';
            return;
        }

        render(items);

    } catch (error) {
        list.innerHTML = 'Помилка завантаження';
    }
}

function render(items) {
    const list = document.getElementById('list');

    list.innerHTML = items.map(item => `
        <div class="card">
            <h3>${item.title}</h3>
            <p>${item.category}</p>
            <p>${item.price} грн</p>

            <button class="edit-btn" data-id="${item.id}">
                Редагувати
            </button>

            <button class="delete-btn" data-id="${item.id}">
                Видалити
            </button>
        </div>
    `).join('');

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', () => {
            editItem(button.dataset.id);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            deleteItem(button.dataset.id);
        });
    });
}

function showStatus(message, isError = false) {
    const status = document.getElementById('status');

    status.textContent = message;
    status.style.display = 'block';
    status.style.padding = '10px';
    status.style.fontWeight = 'bold';

    if (isError) {
        status.style.color = 'red';
        status.style.background = '#ffd6d6';
    } else {
        status.style.color = 'green';
        status.style.background = '#d4edda';
    }
}

async function addItem(e) {
    e.preventDefault();

    const data = {
        title: title.value,
        category: category.value,
        price: Number(price.value)
    };

    if (data.price <= 0) {
        showStatus('Ціна має бути більше 0', true);
        return;
    }

    try {
        await fetch(API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        form.reset();

        await loadItems();

        showStatus('Товар додано');

    } catch {
        showStatus('Помилка додавання', true);
    }
}

async function deleteItem(id) {
    const ok = confirm('Видалити товар?');

    if (!ok) return;

    try {
        await fetch(API + '/' + id, {
            method: 'DELETE'
        });

        await loadItems();

        showStatus('Товар видалено');

    } catch {
        showStatus('Помилка видалення', true);
    }
}

async function editItem(id) {
    const newTitle = prompt('Нова назва товару');

    if (!newTitle) return;

    try {
        await fetch(API + '/' + id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: newTitle
            })
        });

        await loadItems();

        showStatus('Товар оновлено');

    } catch {
        showStatus('Помилка редагування', true);
    }
}