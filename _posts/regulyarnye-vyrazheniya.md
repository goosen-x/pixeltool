---
title: 'Регулярные выражения: как читать и составлять'
excerpt:
  'Шпаргалка по регулярным выражениям: как расшифровать любое выражение по
  токенам, чем жадный квантификатор отличается от ленивого, и готовые паттерны
  для email, URL и телефона — с живым тестером прямо в статье.'
date: '2026-07-23T12:00:00.000Z'
coverImage: '/images/blog/regulyarnye-vyrazheniya.png'
author:
  name: Дмитрий Борисенко
  picture: '/images/avatar.jpeg'
related:
  - proverka-javascript
  - chto-takoe-json
  - html-xml-parser
---

Регулярное выражение вроде `^[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}$` выглядит как
случайный набор символов, пока не знаешь, что каждый символ в нём — это
отдельная команда с чётким смыслом. Разберём алфавит regex по токенам, а дальше
— [живой тестер](/tools/regex-tester) в этой же статье, чтобы сразу проверить
свой пример, не открывая другую вкладку.

## Из чего состоит регулярное выражение

Регулярное выражение читается слева направо, токен за токеном — так же, как
компьютер его и разбирает.

| Токен     | Значение                                              |
| --------- | ----------------------------------------------------- |
| `.`       | любой символ, кроме переноса строки                   |
| `\d`      | цифра (`0-9`)                                         |
| `\D`      | не цифра                                              |
| `\w`      | «словесный» символ: буква, цифра, `_`                 |
| `\s`      | пробельный символ (пробел, таб, перенос строки)       |
| `[abc]`   | один символ из перечисленных — `a`, `b` или `c`       |
| `[^abc]`  | один символ, кроме перечисленных                      |
| `[a-z]`   | диапазон — любая строчная латинская буква             |
| `^`       | начало строки                                         |
| `$`       | конец строки                                          |
| `(...)`   | группа — захватывает совпавший фрагмент               |
| `(?:...)` | группа без захвата — только группирует, не запоминает |
| `a\|b`    | «или» — совпадает `a` либо `b`                        |

Квантификаторы отвечают на вопрос «сколько раз» и всегда стоят сразу после
символа или группы, к которой относятся:

| Квантификатор | Значение                             |
| ------------- | ------------------------------------ |
| `*`           | 0 или больше раз                     |
| `+`           | 1 или больше раз                     |
| `?`           | 0 или 1 раз (необязательный элемент) |
| `{3}`         | ровно 3 раза                         |
| `{2,5}`       | от 2 до 5 раз                        |
| `{2,}`        | 2 или больше раз                     |

Собираем: `\d{3}-\d{2}-\d{2}` читается как «три цифры, дефис, две цифры, дефис,
две цифры» — и совпадёт с `123-45-67`.

## Живой regex-тестер

Впишите свой паттерн и тестовую строку — совпадения подсветятся сразу, без
перезагрузки страницы:

```html:live
// title: Живой regex-тестер
// resultOnly
<div class="regex-demo">
  <div class="regex-demo__row">
    <label for="pattern">Паттерн</label>
    <div class="regex-demo__pattern">
      <span class="regex-demo__slash">/</span>
      <input type="text" id="pattern" value="\d+" spellcheck="false" />
      <span class="regex-demo__slash">/</span>
      <input type="text" id="flags" value="g" class="regex-demo__flags" spellcheck="false" />
    </div>
    <div id="error" class="regex-demo__error"></div>
  </div>

  <div class="regex-demo__row">
    <label for="testText">Тестовая строка</label>
    <textarea id="testText" rows="2" spellcheck="false">Заказ #4521 оформлен 12.05.2026, телефон +7 999 123-45-67</textarea>
  </div>

  <div class="regex-demo__row">
    <label>Результат — <span id="count">0 совпадений</span></label>
    <div id="output" class="regex-demo__output"></div>
  </div>
</div>
```

```css:live
.regex-demo {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 34rem;
}
.regex-demo__row {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.regex-demo__row label {
  font-size: 0.85rem;
  opacity: 0.75;
}
.regex-demo__pattern {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-family: 'Fira Code', Monaco, Consolas, monospace;
}
.regex-demo__slash {
  opacity: 0.5;
}
.regex-demo__pattern input {
  font-family: inherit;
  font-size: 0.95rem;
  padding: 0.45rem 0.6rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(128, 128, 128, 0.35);
  background: transparent;
  color: inherit;
}
.regex-demo__pattern input#pattern {
  flex: 1;
}
.regex-demo__pattern input.regex-demo__flags {
  width: 4rem;
  text-align: center;
}
.regex-demo__error {
  min-height: 1.2rem;
  font-size: 0.82rem;
  color: #ef4444;
}
.regex-demo textarea {
  font-family: 'Fira Code', Monaco, Consolas, monospace;
  font-size: 0.9rem;
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(128, 128, 128, 0.35);
  background: transparent;
  color: inherit;
  resize: vertical;
}
.regex-demo__output {
  font-family: 'Fira Code', Monaco, Consolas, monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  background: rgba(128, 128, 128, 0.1);
  white-space: pre-wrap;
  word-break: break-word;
  min-height: 2.4rem;
}
.regex-demo__output mark {
  background: #fbbf24;
  color: #1a1a1a;
  border-radius: 0.2rem;
  padding: 0 0.05rem;
}
.regex-demo__output .regex-demo__empty {
  opacity: 0.5;
}
```

```js:live
function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function pluralize(n, one, few, many) {
  var mod10 = n % 10
  var mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few
  return many
}

function highlight() {
  var pattern = document.getElementById('pattern').value
  var flagsInput = document.getElementById('flags').value
  var text = document.getElementById('testText').value
  var output = document.getElementById('output')
  var errorEl = document.getElementById('error')
  var countEl = document.getElementById('count')

  if (!pattern) {
    output.innerHTML = escapeHtml(text)
    errorEl.textContent = ''
    countEl.textContent = '0 совпадений'
    return
  }

  var flags = flagsInput.indexOf('g') === -1 ? flagsInput + 'g' : flagsInput
  var regex
  try {
    regex = new RegExp(pattern, flags)
  } catch (e) {
    errorEl.textContent = 'Ошибка в выражении: ' + e.message
    output.innerHTML = escapeHtml(text)
    countEl.textContent = '0 совпадений'
    return
  }
  errorEl.textContent = ''

  var result = ''
  var lastIndex = 0
  var match
  var count = 0
  regex.lastIndex = 0

  while ((match = regex.exec(text)) !== null) {
    result += escapeHtml(text.slice(lastIndex, match.index))
    result += '<mark>' + escapeHtml(match[0]) + '</mark>'
    lastIndex = match.index + match[0].length
    if (match[0].length === 0) regex.lastIndex++
    count++
    if (count > 2000) break
  }
  result += escapeHtml(text.slice(lastIndex))

  output.innerHTML =
    result || '<span class="regex-demo__empty">нет совпадений</span>'
  countEl.textContent =
    count + ' ' + pluralize(count, 'совпадение', 'совпадения', 'совпадений')
}

;['pattern', 'flags', 'testText'].forEach(function (id) {
  document.getElementById(id).addEventListener('input', highlight)
})

highlight()
```

Поставьте курсор в поле паттерна и попробуйте `\d{3}-\d{2}-\d{2}` вместо `\d+` —
подсветится только номер телефона целиком, а не отдельные цифры даты.

## Жадные и ленивые квантификаторы

Это самое частое место, где регулярка «сработала не так».

По умолчанию квантификаторы **жадные** — забирают максимум возможного:

```js
'<b>жирный</b> и <i>курсив</i>'.match(/<.+>/)
// вернёт '<b>жирный</b> и <i>курсив</i>' целиком —
// от первой открывающей до последней закрывающей скобки
```

Жадный `.+` не останавливается на первой попавшейся `>` — он пытается забрать
как можно больше символов, а потом «сдаёт назад» ровно настолько, чтобы
совпадение всё ещё нашлось. Добавьте `?` сразу после квантификатора, чтобы
сделать его **ленивым** — тогда он остановится при первой возможности:

```js
'<b>жирный</b> и <i>курсив</i>'.match(/<.+?>/)
// вернёт только '<b>'
```

Правило простое: нужен самый короткий возможный фрагмент между двумя
разделителями — берите ленивый квантификатор (`*?`, `+?`, `??`). Нужен самый
длинный — оставляйте жадный по умолчанию.

## Флаги

Флаги пишутся после закрывающего слэша и меняют поведение всего выражения:

| Флаг | Что делает                                                                                      |
| ---- | ----------------------------------------------------------------------------------------------- |
| `g`  | глобальный поиск — находит все совпадения, а не только первое                                   |
| `i`  | без учёта регистра                                                                              |
| `m`  | многострочный режим — `^`/`$` работают на границах каждой строки, а не только всей строки       |
| `s`  | `.` дополнительно совпадает с переносом строки                                                  |
| `u`  | режим Unicode — корректная работа с символами вне базовой таблицы (эмодзи, некоторые иероглифы) |

Без `g` `String.prototype.match()` вернёт только первое совпадение и остановится
— частая причина, почему «регулярка вроде рабочая, а находит только один
результат».

## Готовые паттерны

Три выражения, которые пригождаются чаще всего. Совпадения не идеальны на 100%
для экзотических случаев (RFC для email длиннее любой статьи), но покрывают
подавляющее большинство реальных данных:

```js
// Email
const emailPattern = /^[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}$/

// URL (http/https, необязательный путь)
const urlPattern = /^https?:\/\/[\w.-]+\.[a-zA-Z]{2,}(\/\S*)?$/

// Телефон в формате +7 999 123-45-67 (пробелы и дефисы необязательны)
const phonePattern = /^\+7[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/
```

Вставьте любой из них в тестер выше (без `/^.../$`, только то, что между
слэшами) и проверьте на своих данных.

## Частые ошибки при чтении regex

**Забыли экранировать спецсимвол.** Точка `.` в regex значит «любой символ», а
не буквальную точку. Чтобы найти именно точку — экранируйте: `\.`. То же с `+`,
`*`, `?`, `(`, `)`, `[`, `]` — все они спецсимволы, и для буквального совпадения
нужен обратный слэш перед ними.

**Забыли `^` и `$`.** Без них выражение ищет совпадение **где угодно** в строке,
а не проверяет строку целиком. `\d{3}` совпадёт и внутри `abc123def` — если
нужна проверка «строка целиком состоит из трёх цифр», нужны оба якоря:
`^\d{3}$`.

**Перепутали `[]` и `()`.** Квадратные скобки — это «один из перечисленных
символов»: `[abc]` совпадёт с одной буквой `a`, `b` или `c`. Круглые скобки —
это группа: `(abc)` совпадёт только с точной последовательностью «abc» целиком.

## Коротко

- Регулярное выражение читается токен за токеном: `\d`/`\w`/`\s` — классы
  символов, `*`/`+`/`?`/`{n,m}` — сколько раз, `^`/`$` — границы строки.
- Квантификаторы жадные по умолчанию — добавьте `?` после них, чтобы сделать
  ленивыми.
- Без флага `g` вернётся только первое совпадение.
- `.` нужно экранировать (`\.`), если имеется в виду буквальная точка, а не
  «любой символ».
- Не держите готовые паттерны в голове — тестируйте на живых данных.

/tools/regex-tester
