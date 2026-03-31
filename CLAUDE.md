# CLAUDE.md

## Сервер

```
ssh admin@91.197.99.37
```

Контейнер: `pixeltool`, порт 3000.

```bash
# Статус
docker ps --filter name=pixeltool

# Логи
docker logs pixeltool --tail 50
```
