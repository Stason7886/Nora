# PRD — Кроличья Нора (лофт)

## Original problem statement
создай лейдинг пейдж для сайта кроличья нора все структуры и секции возьми с этого изображения,все максимально так же как на изображении
(доп.: желательно сделать все качественно и профессионально; изображения — ИИ + сток; «Забронировать» — прокрутка к контактам; адрес пользователь заменит сам)

## Architecture
Frontend-only React landing (CRA + Tailwind + framer-motion + lenis). Components in /app/frontend/src/components/rn/. Images in /app/frontend/public/img (AI-generated). Favicon /public/favicon.svg. No backend use.

## User personas
Гости, ищущие площадку для дня рождения/вечеринки/корпоратива/съёмки в стиле Алисы в Стране чудес.

## Core requirements
Повторить структуру макета: шапка, герой, «О нас» (пергамент), «Пространство» (тёмная, зоны), «Мероприятия» (полароиды), футер с шахматным полом.

## Implemented (2026-10-31)
- Header (sticky, nav, Забронировать → #contacts, бургер с полноэкранным меню)
- Hero: построчное раскрытие заголовка, 3D-наклон за мышью, параллакс, пыльца, билет-CTA
- About, Space (интерактивные зоны), Events (полароиды), галерея-бегущая строка, Footer
- Lenis плавный скролл, scroll-reveal, рваные края пергамента

## Implemented (2026-10-31, iteration 2)
- Easter egg: Cheshire cat (bottom-left corner, hover 1.2s / long-press)
- Booking form (#contacts): name, phone, date (calendar, no past dates), format, guests, promo, comment → POST /api/bookings (MongoDB `bookings`)
- Secret promo: 5th cat appearance (per browser, localStorage) → GET /api/promo/cheshire → gift card, auto-fills form; server validates code. Code/discount in backend .env PROMO_CODE / PROMO_DISCOUNT

## Backlog
- P1: реальный адрес/телефон/ссылки соцсетей (сейчас плейсхолдеры)
- P1: просмотр заявок для владельца (админка) / уведомления о новых заявках
- P2: полноценная галерея с лайтбоксом, страница мероприятий

## Next tasks
Заменить контакты, добавить форму бронирования.
