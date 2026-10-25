// ====================================================
// 1. АКТУАЛЬНЫЙ ГОД В ПОДВАЛЕ
// ====================================================
const yearEl = document.querySelector('#year');
yearEl.textContent = new Date().getFullYear();

// ====================================================
// 2. ПЕРЕКЛЮЧЕНИЕ ТЁМНОЙ ТЕМЫ
//    JS переключает класс на <html>, а стили описаны в CSS
// ====================================================
const themeBtn = document.querySelector('#theme-toggle');

themeBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');

    const isDark = document.documentElement.classList.contains('dark');
    themeBtn.textContent = isDark ? '☀️' : '🌙';
});

// ====================================================
// 3. ОТПРАВКА ФОРМЫ
// ====================================================
const form = document.querySelector('form');
const statusMsg = document.querySelector('#form-status');

if (form && statusMsg) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Отменяем перезагрузку страницы

        const formData = new FormData(form);

        // Показываем сообщение "Отправка..."
        statusMsg.classList.remove('visible');
        statusMsg.textContent = 'Отправка...';
        statusMsg.classList.add('visible');

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Успех
                const nameInput = document.querySelector('#name');
                const name = nameInput.value.trim();
                
                statusMsg.textContent = `Спасибо, ${name}! Сообщение отправлено.`;
                form.reset();
            } else {
                // Ошибка от Formspree
                statusMsg.textContent = 'Ой, что-то пошло не так. Попробуйте ещё раз.';
            }
        } catch (error) {
            // Ошибка сети (например, пропал интернет)
            statusMsg.textContent = 'Ошибка сети. Проверьте подключение к интернету.';
        }
    });
}

// ====================================================
// 4. КНОПКА «НАВЕРХ» ПОЯВЛЯЕТСЯ ПРИ ПРОКРУТКЕ
// ====================================================
const upBtn = document.querySelector('#to-top');

window.addEventListener('scroll', () => {
    upBtn.classList.toggle('visible', window.scrollY > 400);
});

upBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});