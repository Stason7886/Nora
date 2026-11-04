# PRD — Кроличья Нора (лофт)

## Original problem statement
создай лейдинг пейдж для сайта кроличья нора все структуры и секции возьми с этого изображения,все максимально так же как на изображении
(доп.: желательно сделать все качественно и профессионально; изображения — ИИ + сток; «Забронировать» — прокрутка к контактам; адрес пользователь заменит сам)

## Architecture
React landing (CRA + Tailwind + framer-motion + lenis), components in /app/frontend/src/components/rn/. AI images in /public/img. FastAPI backend: GET /api/promo/cheshire (code/discount from .env PROMO_CODE / PROMO_DISCOUNT); POST /api/bookings exists but unused (form removed by user).

## User personas
Гости, ищущие площадку для праздника в стиле Алисы в Стране чудес.

## Core requirements
Структура макета: шапка, герой, «О нас», «Пространство», «Мероприятия», футер (#contacts).

## Implemented
- 2026-10-31: лендинг по макету, анимации, lenis, галерея-бегущая строка
- 2026-10-31: Чеширский кот (угол, долгое наведение); на 5-й раз — карточка с промокодом («назовите при бронировании»)
- 2026-10-31: форма бронирования добавлена, затем удалена по просьбе пользователя; «свадьбы» убраны из блока «О нас»
- 2026-11-02: MAX link + mobile FAB, sound toggle (WebAudio ticking + purr), GitHub Pages: relative img paths + prebuilt static site in /app/docs (Pages: Deploy from branch main /docs). REBUILD docs after every frontend change: cd frontend && CI=false PUBLIC_URL=. GENERATE_SOURCEMAP=false REACT_APP_BACKEND_URL= BUILD_PATH=/app/docs yarn build && touch /app/docs/.nojekyll. Repo: github.com/Stason7886/Nora → stason7886.github.io/Nora/
## Backlog
- 2026-11-04: call FAB (tel:+79052104194), footer phone; SEO: title/description/keywords, canonical+OG (https://stason7886.github.io/Nora/), EventVenue JSON-LD, noscript, robots/sitemap/llms.txt, og-image.jpg, apple-touch-icon. Pending: Yandex Webmaster / Google Search Console verification codes from user
- P1: реальный адрес/телефон/ссылки соцсетей (плейсхолдеры)
- P2: галерея с лайтбоксом, звуки

## Next tasks
Заменить контакты.
