// Публичный ID счётчика Яндекс.Метрики — не секрет, виден в HTML-коде страницы.
// Не через process.env.NEXT_PUBLIC_*, т.к. Next.js встраивает эти переменные
// на этапе сборки Docker-образа, где они не проброшены (см. Dockerfile).
export const YANDEX_METRIKA_ID = 110360226
