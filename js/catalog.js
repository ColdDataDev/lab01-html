document.addEventListener('DOMContentLoaded', init);

let allItems = [];
let visible = 2;
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

async function init() {
    await loadItems();

    document.getElementById('search').addEventListener('input', render);
    document.getElementById('filter').addEventListener('change', render);
    document.getElementById('sort').addEventListener('change', render);

    document.getElementById('load-more').addEventListener('click', () => {
        visible += 2;
        render();
    });
}

async function loadItems() {
    try {
        const response = await fetch('../data/items.json');

        if (!response.ok) throw new Error();

        allItems = await response.json();

        render();

    } catch {
        document.getElementById('status').textContent =
            'Помилка завантаження';
    }
}

function render() {
    const catalog = document.getElementById('catalog');
    const status = document.getElementById('status');

    let items = [...allItems];

    const search = document.getElementById('search').value.toLowerCase();
    const filter = document.getElementById('filter').value;
    const sort = document.getElementById('sort').value;

    items = items.filter(item =>
        item.title.toLowerCase().includes(search)
    );

    if (filter !== 'all') {
        items = items.filter(item =>
            item.category === filter
        );
    }

    if (sort === 'title') {
        items.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sort === 'price') {
        items.sort((a, b) => a.price - b.price);
    }

    if (items.length === 0) {
        status.textContent = 'Нічого не знайдено';
        catalog.innerHTML = '';
        return;
    }

    status.textContent = '';

    catalog.innerHTML = items.slice(0, visible).map(item => `
        <div class="card">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <p>${item.price} грн</p>

            <button class="fav-btn" data-id="${item.id}">
                ${favorites.includes(item.id)
                    ? '★ В обраному'
                    : '☆ В обране'}
            </button>
        </div>
    `).join('');

    document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            toggleFavorite(Number(btn.dataset.id));
        });
    });
}

function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(item => item !== id);
    } else {
        favorites.push(id);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));

    render();
}