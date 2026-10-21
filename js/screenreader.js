// js/screenreader.js
(function () {
  console.log('screenreader.js загружен');

  let enabled = false;
  let elements = [];
  let index = -1;
  let voice = null;

  function loadVoices() {
    const voices = window.speechSynthesis.getVoices();
    voice = voices.find(v => v.lang.startsWith('ru')) || voices[0];
  }

  function speak(text) {
    if (!text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ru-RU';
    if (voice) u.voice = voice;
    u.rate = 1.1;
    window.speechSynthesis.speak(u);
  }

  function collectElements() {
    const selector = 'h1, h2, h3, h4, h5, h6, a[href], button, input, select, textarea, img[alt]';
    elements = Array.from(document.querySelectorAll(selector))
      .filter(el => el.offsetParent !== null);
    console.log('Найдено элементов:', elements.length);
  }

  function getRole(el) {
    const roles = {
      h1: 'Заголовок первого уровня',
      h2: 'Заголовок второго уровня',
      h3: 'Заголовок третьего уровня',
      a: 'Ссылка',
      button: 'Кнопка',
      input: 'Поле ввода',
      img: 'Изображение',
      textarea: 'Текстовое поле'
    };
    return roles[el.tagName.toLowerCase()] || 'Элемент';
  }

  function getName(el) {
    return el.getAttribute('aria-label') || el.alt || el.value ||
           (el.textContent || '').trim().slice(0, 100);
  }

  function announce(el) {
    speak(getRole(el) + ': ' + getName(el));
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    el.style.outline = '3px solid #ff5722';
    setTimeout(() => { el.style.outline = ''; }, 1500);
  }

  function toggle() {
    enabled = !enabled;
    console.log('Скринридер:', enabled ? 'ВКЛ' : 'ВЫКЛ');
    if (enabled) {
      collectElements();
      speak('Скринридер включён');
    } else {
      window.speechSynthesis.cancel();
      speak('Скринридер выключен');
    }
  }

  // Создаём кнопку
  function createButton() {
    const btn = document.createElement('button');
    btn.textContent = '🔊 Скринридер';
    btn.style.cssText = 'position:fixed;bottom:20px;left:20px;z-index:2147483647;padding:12px 20px;background:#6c5ce7;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:bold;';
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      console.log('КЛИК!');
      toggle();
    });
    document.body.appendChild(btn);
    console.log('Кнопка создана и добавлена в DOM');
  }

  // Навигация по клавишам
  document.addEventListener('keydown', function (e) {
    if (!enabled) return;
    if (e.altKey && e.key === 'ArrowDown') {
      e.preventDefault();
      if (!elements.length) return;
      index = (index + 1) % elements.length;
      announce(elements[index]);
    }
    if (e.altKey && e.key === 'ArrowUp') {
      e.preventDefault();
      if (!elements.length) return;
      index = (index - 1 + elements.length) % elements.length;
      announce(elements[index]);
    }
  });

  // Загружаем голоса (они грузятся асинхронно)
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  // Запускаем когда DOM готов
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createButton);
  } else {
    createButton();
  }

  // Даём доступ из консоли для проверки
  window.sr = { toggle: toggle };
})();