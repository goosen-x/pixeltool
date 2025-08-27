# 🔗 Система коротких ссылок PixelTool

## 🌍 Важно: Все короткие ссылки ведут на английскую версию сайта!

## 📋 Доступные короткие ссылки

| Социальная сеть | Короткая ссылка       | Редирект на                                                 |
| --------------- | --------------------- | ----------------------------------------------------------- |
| TikTok          | `pixeltool.pro/s/tk`  | `pixeltool.pro/en?utm_source=tiktok&utm_medium=social`      |
| Instagram       | `pixeltool.pro/s/ig`  | `pixeltool.pro/en?utm_source=instagram&utm_medium=social`   |
| Twitter/X       | `pixeltool.pro/s/tw`  | `pixeltool.pro/en?utm_source=twitter&utm_medium=social`     |
| X (новый)       | `pixeltool.pro/s/x`   | `pixeltool.pro/en?utm_source=x&utm_medium=social`           |
| Facebook        | `pixeltool.pro/s/fb`  | `pixeltool.pro/en?utm_source=facebook&utm_medium=social`    |
| YouTube         | `pixeltool.pro/s/yt`  | `pixeltool.pro/en?utm_source=youtube&utm_medium=social`     |
| LinkedIn        | `pixeltool.pro/s/ln`  | `pixeltool.pro/en?utm_source=linkedin&utm_medium=social`    |
| Telegram        | `pixeltool.pro/s/tg`  | `pixeltool.pro/en?utm_source=telegram&utm_medium=social`    |
| WhatsApp        | `pixeltool.pro/s/wa`  | `pixeltool.pro/en?utm_source=whatsapp&utm_medium=social`    |
| Reddit          | `pixeltool.pro/s/rd`  | `pixeltool.pro/en?utm_source=reddit&utm_medium=social`      |
| Pinterest       | `pixeltool.pro/s/pin` | `pixeltool.pro/en?utm_source=pinterest&utm_medium=social`   |
| VKontakte       | `pixeltool.pro/s/vk`  | `pixeltool.pro/en?utm_source=vkontakte&utm_medium=social`   |
| GitHub          | `pixeltool.pro/s/gh`  | `pixeltool.pro/en?utm_source=github&utm_medium=social`      |
| Product Hunt    | `pixeltool.pro/s/ph`  | `pixeltool.pro/en?utm_source=producthunt&utm_medium=social` |

## 🎯 Использование

### В социальных сетях

```
✅ pixeltool.pro/s/tk
❌ pixeltool.pro/?utm_source=tiktok&utm_medium=social
```

### В QR-кодах

Генерация QR-кода:
`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://pixeltool.pro/s/tk`

## 📊 Аналитика

Все переходы автоматически отслеживаются в:

- Яндекс.Метрика (Goal: `social_redirect`)
- Google Analytics (Event: `social_redirect`)

## 🛠️ Техническая реализация

### Структура файлов

```
/lib/constants/social-links.ts    # Конфигурация всех ссылок
/app/s/[social]/route.ts         # Route handler для редиректов
/app/s/page.tsx                  # Страница со всеми ссылками
/middleware.ts                   # Обработка редиректов
```

### Добавление новой соцсети

1. Добавьте в `/lib/constants/social-links.ts`:

```typescript
newplatform: {
    id: 'newplatform',
    name: 'New Platform',
    shortCode: 'np',
    utm_source: 'newplatform',
    utm_medium: 'social',
    icon: '🆕',
    color: '#123456'
}
```

### Использование в компонентах

```tsx
import { ShortLinksDisplay } from '@/components/marketing/ShortLinksDisplay'

// В любом компоненте
;<ShortLinksDisplay />
```

## 🔒 Безопасность

- Все неизвестные коды редиректят на главную страницу
- UTM-параметры добавляются автоматически на сервере
- Нет прямого доступа к полным URL с параметрами

## 📱 Мобильная оптимизация

Короткие ссылки особенно удобны для:

- Stories в Instagram/Facebook
- Био в TikTok
- Описаний в YouTube
- Твитов с ограничением символов
