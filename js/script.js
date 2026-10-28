// ====================================================
// 1. ГОД И ПАНЕЛЬ НАСТРОЕК
// ====================================================
const yearEl = document.querySelector('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const settingsBtn = document.querySelector('#settings-btn');
const settingsPanel = document.querySelector('#settings-panel');

if (settingsBtn && settingsPanel) {
    settingsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        settingsPanel.classList.toggle('show');
    });
}

// ====================================================
// 2. ТЕМНАЯ ТЕМА
// ====================================================
const themeBtn = document.querySelector('#theme-toggle');
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        themeBtn.innerHTML = isDark ? '☀️ Светлая тема' : '🌙 Тёмная тема';
    });
}

// ====================================================
// 3. ОТПРАВКА ФОРМЫ
// ====================================================
const form = document.querySelector('form');
const statusMsg = document.querySelector('#form-status');

if (form && statusMsg) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        statusMsg.textContent = 'Отправка...';
        statusMsg.style.color = '#2d3748';
        statusMsg.classList.add('visible');
        try {
            const response = await fetch(form.action, {
                method: 'POST', body: formData, headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                const name = document.querySelector('#name').value.trim();
                statusMsg.textContent = `Спасибо, ${name}! Сообщение отправлено.`;
                statusMsg.style.color = '#2f855a';
                form.reset();
            } else {
                statusMsg.textContent = 'Ошибка при отправке. Попробуйте еще раз.';
                statusMsg.style.color = '#e53e3e';
            }
        } catch (error) {
            statusMsg.textContent = 'Ошибка сети. Проверьте интернет.';
            statusMsg.style.color = '#e53e3e';
        }
    });
}

// ====================================================
// 4. КНОПКА «НАВЕРХ»
// ====================================================
const upBtn = document.querySelector('#to-top');
if (upBtn) {
    window.addEventListener('scroll', () => { upBtn.classList.toggle('visible', window.scrollY > 400); });
    upBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ====================================================
// 5. ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ
// ====================================================
const viBtn = document.querySelector('#visually-impaired-toggle');
if (viBtn) {
    viBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('high-contrast');
        viBtn.innerHTML = document.documentElement.classList.contains('high-contrast') 
            ? '☀️ Обычная версия' : '🌓 Высокая контрастность';
    });
}

// ====================================================
// 6. УВЕЛИЧЕНИЕ ШРИФТА
// ====================================================
const fontIncrease = document.querySelector('#font-increase');
const fontDecrease = document.querySelector('#font-decrease');
const fontSizeDisplay = document.querySelector('#font-size-display');
let currentFontSize = 100;

if (fontIncrease && fontDecrease && fontSizeDisplay) {
    fontIncrease.addEventListener('click', () => {
        if (currentFontSize < 150) {
            currentFontSize += 10;
            document.documentElement.style.fontSize = currentFontSize + '%';
            fontSizeDisplay.textContent = currentFontSize + '%';
        }
    });
    fontDecrease.addEventListener('click', () => {
        if (currentFontSize > 70) {
            currentFontSize -= 10;
            document.documentElement.style.fontSize = currentFontSize + '%';
            fontSizeDisplay.textContent = currentFontSize + '%';
        }
    });
}

// ====================================================
// 7. СКРИНРИДЕР
// ====================================================
const srBtn = document.querySelector('#screenreader-btn');
const srNav = document.querySelector('#sr-nav');
const srPrev = document.querySelector('#sr-prev');
const srNext = document.querySelector('#sr-next');
let srEnabled = false;
let srElements = [];
let srIndex = -1;
let srVoice = null;

if (srBtn) {
    function loadVoices() {
        const voices = window.speechSynthesis.getVoices();
        srVoice = voices.find(v => v.lang.startsWith('ru')) || voices[0];
    }
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) window.speechSynthesis.onvoiceschanged = loadVoices;

    function speak(text) {
        if (!text) return;
        window.speechSynthesis.cancel();
        setTimeout(() => {
            const u = new SpeechSynthesisUtterance(text);
            u.lang = 'ru-RU';
            if (srVoice) u.voice = srVoice;
            u.rate = 1.0;
            window.speechSynthesis.speak(u);
        }, 50);
    }

    function collectElements() {
        srElements = [];
        
        // 0. Читаем настройки, если открыты
        if (settingsPanel && settingsPanel.classList.contains('show')) {
            const panelTitle = settingsPanel.querySelector('.panel-header h3');
            if (panelTitle) srElements.push({ element: panelTitle, text: `Раздел: ${panelTitle.innerText}` });

            settingsPanel.querySelectorAll('.panel-btn').forEach(btn => {
                // Временно сохраняем текст, он обновится в функции announce
                srElements.push({ element: btn, text: '' });
            });

            const btnDec = settingsPanel.querySelector('#font-decrease');
            const btnInc = settingsPanel.querySelector('#font-increase');
            if (btnDec) srElements.push({ element: btnDec, text: 'Кнопка: Уменьшить шрифт' });
            if (btnInc) srElements.push({ element: btnInc, text: 'Кнопка: Увеличить шрифт' });
        }

        // 1. Меню
        document.querySelectorAll('nav a').forEach(link => srElements.push({ element: link, text: `Ссылка: ${link.innerText}` }));

        // 2. Шапка
        const h1 = document.querySelector('header h1');
        const subP = document.querySelector('header p');
        if (h1 && subP) srElements.push({ element: h1, text: `${h1.innerText}. ${subP.innerText}` });

        // 3. Обо мне
        const aboutImg = document.querySelector('#about img');
        const aboutH2 = document.querySelector('#about h2');
        const aboutP = document.querySelector('#about p');
        if (aboutImg) srElements.push({ element: aboutImg, text: `Изображение: ${aboutImg.alt}` });
        if (aboutH2 && aboutP) srElements.push({ element: aboutH2, text: `Раздел: ${aboutH2.innerText}. ${aboutP.innerText}` });

        // 4. Навыки
        const skillsH2 = document.querySelector('#skills h2');
        const skillsUl = document.querySelector('#skills ul');
        if (skillsH2 && skillsUl) {
            const listText = Array.from(skillsUl.querySelectorAll('li')).map(li => li.innerText).join('. ');
            srElements.push({ element: skillsH2, text: `Раздел: ${skillsH2.innerText}. ${listText}` });
        }

        // 5. Проекты
        const projectsH2 = document.querySelector('#projects h2');
        if (projectsH2) srElements.push({ element: projectsH2, text: `Раздел: ${projectsH2.innerText}` });
        document.querySelectorAll('#projects article').forEach(art => {
            const h3 = art.querySelector('h3');
            const p = art.querySelector('p');
            const link = art.querySelector('a');
            const cleanTitle = h3 ? h3.innerText.replace(/[^\w\sа-яА-Я.,!?-]/g, '').trim() : '';
            let projectText = 'Проект: ';
            if (cleanTitle) projectText += cleanTitle + '. ';
            if (p) projectText += p.innerText;
            srElements.push({ element: art, text: projectText });
            if (link) srElements.push({ element: link, text: `Ссылка: ${link.innerText.replace('→', '').trim()} ${cleanTitle}` });
        });

        // 6. Контакты
        const contactsH2 = document.querySelector('#contacts h2');
        if (contactsH2) srElements.push({ element: contactsH2, text: `Раздел: ${contactsH2.innerText}` });
        document.querySelectorAll('form input, form textarea, form button[type="submit"]').forEach(input => {
            let text = '';
            let labelText = '';
            if (input.id) {
                const label = document.querySelector(`label[for="${input.id}"]`);
                if (label) labelText = label.innerText.trim() + '. ';
            }
            if (input.id === 'name') text = `Поле ввода: ${labelText}Введите ваше имя`;
            else if (input.id === 'email') text = `Поле ввода: ${labelText}Введите вашу почту`;
            else if (input.id === 'msg') text = `Поле ввода: ${labelText}Введите ваше сообщение`;
            else if (input.type === 'submit') text = `Кнопка: Отправить сообщение`;
            else text = `Поле ввода: ${labelText}${input.placeholder || 'Текст'}`;
            srElements.push({ element: input, text: text });
        });

        // 7. Подвал и Наверх
        const footerP = document.querySelector('footer p');
        if (footerP) srElements.push({ element: footerP, text: `Подвал сайта: ${footerP.innerText.replace('©', 'Копирайт')}` });
        if (upBtn) srElements.push({ element: upBtn, text: 'Кнопка: Наверх' });
    }

    function announce(item) {
        let textToSpeak = item.text;
        
        // ФИКС: Если это кнопки, текст которых меняется, читаем их АКТУАЛЬНЫЙ текст прямо сейчас!
        const dynamicBtns = ['theme-toggle', 'visually-impaired-toggle', 'screenreader-btn'];
        if (item.element.id && dynamicBtns.includes(item.element.id)) {
            let cleanText = item.element.innerText.replace(/[^\w\sа-яА-Я.,!?-]/g, '').trim();
            textToSpeak = `Кнопка: ${cleanText}`;
        }

        speak(textToSpeak);
        item.element.scrollIntoView({ block: 'center', behavior: 'smooth' });
        item.element.style.outline = '3px solid #ff5722';
        setTimeout(() => { item.element.style.outline = ''; }, 1500);
    }

    srBtn.addEventListener('click', () => {
        srEnabled = !srEnabled;
        if (srEnabled) {
            collectElements();
            speak('Скринридер включён. Используйте кнопки в нижнем левом углу, чтобы озвучить текст.'); 
            srBtn.innerHTML = '🔇 Выключить';
            srBtn.style.background = '#e53e3e';
            srBtn.style.color = '#fff';
            if (srNav) srNav.style.display = 'flex';
        } else {
            window.speechSynthesis.cancel();
            speak('Скринридер выключен');
            srBtn.innerHTML = '🔊 Озвучить текст';
            srBtn.style.background = ''; 
            srBtn.style.color = '';
            if (srNav) srNav.style.display = 'none';
        }
    });

    if (srNext) srNext.addEventListener('click', () => {
        if (!srEnabled || !srElements.length) return;
        srIndex = (srIndex + 1) % srElements.length;
        announce(srElements[srIndex]);
    });

    if (srPrev) srPrev.addEventListener('click', () => {
        if (!srEnabled || !srElements.length) return;
        srIndex = (srIndex - 1 + srElements.length) % srElements.length;
        announce(srElements[srIndex]);
    });
}