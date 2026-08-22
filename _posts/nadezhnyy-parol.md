---
title: 'Как создать надёжный пароль: пошаговое руководство'
excerpt:
  'Пошаговая инструкция, как придумать пароль, который не взломают перебором:
  сколько символов нужно на самом деле, какие правила из школьных памяток уже
  устарели и как проверить готовый пароль, не отправляя его на сомнительный
  сайт.'
date: '2026-07-22T12:00:00.000Z'
coverImage: '/images/blog/nadezhnyy-parol.png'
author:
  name: Дмитрий Борисенко
  picture: '/images/avatar.jpeg'
related:
  - kak-provesti-rozygrysh-sluchaynym-chislom
  - chto-takoe-uuid
  - kak-sozdat-qr-kod
---

Больше половины утечек происходит из-за пароля вроде `qwerty123` или собственной
даты рождения, а вовсе не из-за хитрых атак. «Надёжный» и «сложный» пароль на
практике одно и то же, оба слова описывают пароль, который долго перебирать.
Разберём по шагам, что делает его таким, а что осталось мифом из старых
корпоративных памяток.

## Что делает пароль надёжным

Пароль ломают перебором, программа за секунды проверяет миллиарды комбинаций.
Надёжность пароля и есть то, сколько времени займёт такой перебор, а зависит она
от двух вещей.

- Длина. Каждый добавленный символ увеличивает число вариантов кратно, а не в
  полтора-два раза. Точное время перебора зависит ещё от алфавита и мощности
  атакующего, свой случай посчитайте в калькуляторе ниже.
- Алфавит. Строчные буквы, заглавные, цифры и символы вместе дают куда больше
  комбинаций на каждую позицию, чем один тип символов.

Отсюда практический вывод, который расходится с интуицией. Длина важнее
хитрости. `korrektnayaloshadbatareyaskrepka` из четырёх случайных слов надёжнее,
чем `P@ssw0rd!`, хотя второй выглядит «сложнее». Осмысленные замены букв на
символы (`o` → `0`, `a` → `@`) программы перебора проверяют в первую очередь.

Сколько именно займёт перебор, зависит от длины, алфавита и того, насколько
быстро атакующий может проверять варианты. Подставьте свои значения:

```html:live
// title: Калькулятор времени перебора пароля
// resultOnly
<div class="pw-calc">
  <div class="pw-calc__controls">
    <div class="pw-calc__field">
      <div class="pw-calc__field-head">
        <label for="pwLength">Длина пароля</label>
        <span class="pw-calc__badge" id="pwLengthValue">12</span>
      </div>
      <input type="range" id="pwLength" class="pw-calc__range" min="4" max="24" value="12" />
    </div>

    <div class="pw-calc__field">
      <span class="pw-calc__field-label">Набор символов</span>
      <div class="pw-calc__chips">
        <label class="pw-calc__chip">
          <input type="checkbox" id="chkLower" checked disabled />
          <span>a-z <em>26</em></span>
        </label>
        <label class="pw-calc__chip">
          <input type="checkbox" id="chkUpper" checked />
          <span>A-Z <em>+26</em></span>
        </label>
        <label class="pw-calc__chip">
          <input type="checkbox" id="chkDigits" checked />
          <span>0-9 <em>+10</em></span>
        </label>
        <label class="pw-calc__chip">
          <input type="checkbox" id="chkSymbols" />
          <span>!@#$ <em>+32</em></span>
        </label>
      </div>
    </div>

    <p class="pw-calc__note">
      Расчёт для быстрого хэша (MD5/SHA-1 на GPU) — 10 млрд паролей/сек
    </p>
  </div>

  <div class="pw-calc__result">
    <div class="pw-calc__stat">
      <span class="pw-calc__stat-label">Комбинаций всего</span>
      <strong class="pw-calc__stat-value" id="pwCombinations">—</strong>
    </div>
    <div class="pw-calc__divider" aria-hidden="true"></div>
    <div class="pw-calc__stat pw-calc__stat--hero">
      <span class="pw-calc__stat-label">Перебор в среднем займёт</span>
      <strong class="pw-calc__stat-value" id="pwTime">—</strong>
      <span class="pw-calc__stat-note" id="pwTimeNote"></span>
    </div>
  </div>
</div>
```

```css:live
.pw-calc {
  --pw-accent: #4a90e2;
  --pw-accent-strong: #2f6fc4;
  --pw-accent-soft: rgba(74, 144, 226, 0.12);
  --pw-border: rgba(15, 23, 42, 0.14);
  --pw-text: #0f172a;
  --pw-text-muted: rgba(15, 23, 42, 0.58);
  --pw-surface: rgba(15, 23, 42, 0.035);
  --pw-surface-strong: rgba(15, 23, 42, 0.06);
  --pw-track: rgba(15, 23, 42, 0.14);

  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--pw-text);
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  width: 100%;
}
@media (min-width: 40rem) {
  .pw-calc {
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
    align-items: stretch;
  }
}
@media (prefers-color-scheme: dark) {
  .pw-calc {
    --pw-accent-strong: #7fb2ec;
    --pw-border: rgba(226, 232, 240, 0.16);
    --pw-text: #e9edf5;
    --pw-text-muted: rgba(233, 237, 245, 0.58);
    --pw-surface: rgba(226, 232, 240, 0.045);
    --pw-surface-strong: rgba(226, 232, 240, 0.08);
    --pw-track: rgba(226, 232, 240, 0.18);
  }
}

.pw-calc__controls {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  min-width: 0;
}

.pw-calc__field {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.pw-calc__field-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.pw-calc__field label,
.pw-calc__field-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--pw-text-muted);
}

.pw-calc__badge {
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--pw-accent-strong);
  background: var(--pw-accent-soft);
  border-radius: 999px;
  padding: 0.2rem 0.7rem;
  min-width: 2.4rem;
  text-align: center;
}

.pw-calc__range {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 0.375rem;
  border-radius: 999px;
  background: linear-gradient(
    to right,
    var(--pw-accent) var(--pw-range-progress, 40%),
    var(--pw-track) var(--pw-range-progress, 40%)
  );
  cursor: pointer;
}
.pw-calc__range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 50%;
  background: #ffffff;
  border: 0.1875rem solid var(--pw-accent);
  box-shadow: 0 0.0625rem 0.25rem rgba(15, 23, 42, 0.25);
  cursor: pointer;
  transition: transform 0.15s ease;
}
.pw-calc__range::-webkit-slider-thumb:hover {
  transform: scale(1.08);
}
.pw-calc__range::-moz-range-track {
  height: 0.375rem;
  border-radius: 999px;
  background: transparent;
}
.pw-calc__range::-moz-range-thumb {
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 50%;
  background: #ffffff;
  border: 0.1875rem solid var(--pw-accent);
  box-shadow: 0 0.0625rem 0.25rem rgba(15, 23, 42, 0.25);
  cursor: pointer;
}

.pw-calc__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.pw-calc__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  border: 0.0625rem solid var(--pw-border);
  background: var(--pw-surface);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--pw-text-muted);
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    color 0.15s ease;
}
.pw-calc__chip:has(input:checked) {
  border-color: var(--pw-accent);
  background: var(--pw-accent-soft);
  color: var(--pw-accent-strong);
}
.pw-calc__chip:has(input:disabled) {
  opacity: 0.65;
  cursor: default;
}
.pw-calc__chip input {
  accent-color: var(--pw-accent);
  width: 0.9rem;
  height: 0.9rem;
  cursor: pointer;
}
.pw-calc__chip:has(input:disabled) input {
  cursor: default;
}
.pw-calc__chip em {
  font-style: normal;
  opacity: 0.75;
}

.pw-calc__note {
  margin: -0.6rem 0 0;
  font-size: 0.75rem;
  color: var(--pw-text-muted);
}

.pw-calc__result {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.1rem;
  padding: 1.4rem 1.5rem;
  border-radius: 0.9rem;
  background: var(--pw-surface-strong);
  border: 0.0625rem solid var(--pw-border);
  min-width: 0;
}
.pw-calc__divider {
  width: 100%;
  height: 0.0625rem;
  background: var(--pw-border);
}
.pw-calc__stat {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}
.pw-calc__stat-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--pw-text-muted);
}
.pw-calc__stat-value {
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.pw-calc__stat-value sup {
  font-size: 0.6em;
  margin-left: 0.05em;
}
.pw-calc__stat--hero .pw-calc__stat-value {
  font-size: 1.875rem;
  color: var(--pw-accent-strong);
}
/* Короткие значения ("5 112 лет") держат крупный размер, а длинные фразы
   ("меньше секунды") — саму эту фразу — иначе текст не помещается в блок. */
.pw-calc__stat--hero .pw-calc__stat-value--long {
  font-size: 1.25rem;
}
.pw-calc__stat-note {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--pw-text-muted);
}
.pw-calc__stat-note:empty {
  display: none;
}
.pw-calc__stat-note:before {
  content: '≈ ';
}
```

```js:live
function updateRangeProgress() {
  var input = document.getElementById('pwLength')
  var min = parseFloat(input.min)
  var max = parseFloat(input.max)
  var pct = ((input.value - min) / (max - min)) * 100
  input.style.setProperty('--pw-range-progress', pct + '%')
}

function charsetSize() {
  var size = 26
  if (document.getElementById('chkUpper').checked) size += 26
  if (document.getElementById('chkDigits').checked) size += 10
  if (document.getElementById('chkSymbols').checked) size += 32
  return size
}

function formatCombinations(n) {
  if (n < 1e6) return Math.round(n).toLocaleString('ru-RU')
  var exp = Math.floor(Math.log10(n))
  var mantissa = n / Math.pow(10, exp)
  return mantissa.toFixed(2) + ' × 10<sup>' + exp + '</sup>'
}

// Лестница аналогий от самой близкой к нулю к самой далёкой: подбираем
// первый порог, который years уже перерос, чтобы масштаб числа был на слуху
// не только в случае «больше Вселенной», а на любом отрезке шкалы.
var YEARS_ANALOGIES = [
  [1.38e10, 'больше, чем существует Вселенная'],
  [4.5e9, 'дольше, чем существует Земля'],
  [6.6e7, 'дольше, чем прошло с вымирания динозавров'],
  [3e5, 'дольше, чем существует вид Homo sapiens'],
  [1.17e4, 'дольше, чем прошло с последнего ледникового периода'],
  [4500, 'дольше, чем стоят египетские пирамиды'],
  [80, 'дольше человеческой жизни']
]

function yearsAnalogy(years) {
  for (var i = 0; i < YEARS_ANALOGIES.length; i++) {
    if (years >= YEARS_ANALOGIES[i][0]) return YEARS_ANALOGIES[i][1]
  }
  return ''
}

// Русское склонение "год/года/лет" — без него "1 лет" режет глаз.
function pluralYears(n) {
  var rem100 = n % 100
  var rem10 = n % 10
  if (rem100 >= 11 && rem100 <= 14) return 'лет'
  if (rem10 === 1) return 'год'
  if (rem10 >= 2 && rem10 <= 4) return 'года'
  return 'лет'
}

function formatTime(seconds) {
  if (seconds < 1) return { value: 'меньше секунды', note: '' }

  var minute = 60
  var hour = 3600
  var day = 86400
  var year = 365.25 * day

  if (seconds < minute) return { value: Math.round(seconds) + ' сек', note: '' }
  if (seconds < hour) {
    return { value: Math.round(seconds / minute) + ' мин', note: '' }
  }
  if (seconds < day) return { value: Math.round(seconds / hour) + ' ч', note: '' }
  if (seconds < year) return { value: Math.round(seconds / day) + ' дн', note: '' }

  var years = seconds / year
  var note = yearsAnalogy(years)

  if (years < 1e6) {
    var roundedYears = Math.round(years)
    return {
      value:
        roundedYears.toLocaleString('ru-RU') + ' ' + pluralYears(roundedYears),
      note: note
    }
  }

  var exp = Math.floor(Math.log10(years))
  var mantissa = years / Math.pow(10, exp)
  return {
    value: mantissa.toFixed(2) + ' × 10<sup>' + exp + '</sup> лет',
    note: note
  }
}

var BRUTE_FORCE_SPEED = 10000000000 // быстрый хэш (MD5/SHA-1 на GPU), паролей/сек

function update() {
  var length = parseInt(document.getElementById('pwLength').value, 10)

  document.getElementById('pwLengthValue').textContent = length
  updateRangeProgress()

  var size = charsetSize()
  var combinations = Math.pow(size, length)
  var avgSeconds = combinations / 2 / BRUTE_FORCE_SPEED
  var time = formatTime(avgSeconds)

  document.getElementById('pwCombinations').innerHTML =
    formatCombinations(combinations)

  var timeEl = document.getElementById('pwTime')
  timeEl.innerHTML = time.value
  timeEl.classList.toggle(
    'pw-calc__stat-value--long',
    timeEl.textContent.length > 10
  )
  document.getElementById('pwTimeNote').textContent = time.note
}

;['pwLength', 'chkUpper', 'chkDigits', 'chkSymbols'].forEach(function (id) {
  document.getElementById(id).addEventListener('input', update)
})

update()
```

Это не точный прогноз, а прикидка на глаз. Здесь считается, сколько в среднем
займёт перебрать все комбинации подряд, без более быстрых способов взлома
конкретного алгоритма хеширования. Реальная скорость атаки зависит от того, чем
и как захешированы пароли на сервере, который вы не контролируете. Но масштаб
понятен: лишний символ значит для времени перебора куда больше, чем ещё один тип
символов в алфавите.

## Пошаговое руководство

1. Берите не меньше 15 символов. Таков актуальный минимум стандарта NIST SP
   800-63B (редакция 2025 года) для пароля как единственного фактора входа. Для
   важных аккаунтов вроде почты, банка и менеджера паролей берите от 20.

2. Смешивайте типы символов, но не потому что обязаны. Тот же стандарт прямо
   запрещает сервисам требовать обязательное смешение типов, длина значит
   больше. Но раз пароль всё равно генерируется, а не запоминается, лишним это
   не будет. Заглавные и строчные буквы, цифры, хотя бы один спецсимвол
   увеличивают алфавит без всяких усилий с вашей стороны.

3. Не используйте ничего личного и ничего из словаря. Имена, даты рождения,
   клички питомцев, названия городов программа подбора проверяет первыми, потому
   что такие данные утекают вместе с остальной перепиской в соцсетях. По той же
   причине не подходят цельные слова: `dragon2024` перебирается по словарю
   быстрее, чем случайный набор символов той же длины.

4. Один пароль — один сайт. Если пароль от почты и от форума на одном и том же
   наборе символов, утечка из слабо защищённого форума открывает доступ и к
   почте. Придумывать уникальный пароль для каждого сайта в голове невозможно,
   тут и пригодится генератор.

5. Или используйте фразу из случайных слов. Если пароль всё же нужно запомнить и
   ввести руками, скажем на телевизоре или консоли, берите 4–5 случайных не
   связанных по смыслу слов через дефис или точку.
   `ocean.thunder.crystal.forest` держит длину и легко набирается, в отличие от
   `X7$mK9#pL2!`.

## Как сгенерировать надёжный пароль автоматически

Придумывать случайный набор символов вручную — плохая идея. Человеческий мозг не
умеет быть по-настоящему случайным, и в «случайных» паролях, которые люди
придумывают сами, статистически повторяются одни и те же паттерны. Эту работу
стоит отдать [генератору паролей](/tools/password-generator). Он собирает пароль
из настоящих случайных чисел (`crypto.getRandomValues`), а не из паттернов в
голове, и делает это прямо в браузере, не отправляя ничего на сервер.

В инструменте три режима под разные задачи: случайный набор символов заданной
длины, «запоминающийся» пароль по шаблону вроде `word-word-number` и парольная
фраза из нескольких слов, тот самый вариант из шага 5, только вводить его руками
не придётся.

Если генерируете пароль на чужом или общедоступном компьютере, открывайте
генератор в режиме инкогнито, то есть в приватном окне браузера. Так вкладка не
попадёт в историю, браузер не предложит сохранить «пароль» в автозаполнение, а
после закрытия окна не останется следов сессии, которые сможет прочитать
следующий, кто сядет за этот компьютер.

## Если нужна именно программа для компьютера, а не браузерный инструмент

Иногда вместо вкладки в браузере хочется постоянную программу на компьютере,
чтобы генерировать пароли без интернета или встроить их в привычный рабочий
процесс. Для этого есть
[подборка десктопных генераторов паролей для Windows](https://www.softsalad.ru/articles/best-programms/password-generators).

## Как проверить пароль на надёжность

Прежде чем вводить пароль на новом сайте, стоит прикинуть, достаточно ли он
длинный и разнообразный по символам. Это и есть основной критерий, который
проверяют счётчики надёжности. У генератора паролей на PixelTool такой индикатор
встроен, силу пароля он показывает сразу при генерации.

Есть и обратная сторона. Никогда не вводите свой настоящий действующий пароль в
сторонний «проверятель надёжности», вы не знаете, что происходит с данными на
той стороне. Проверяйте на сгенерированном примере или на пароле, который всё
равно собираетесь сменить.

## Где хранить готовые пароли

Уникальный длинный пароль для каждого сайта невозможно удержать в голове, да и
не нужно. Для этого существуют менеджеры паролей. Они хранят пароли в
зашифрованном виде и сами подставляют нужный при входе, так что запомнить
достаточно одного мастер-пароля. Встроенные менеджеры есть в браузерах и
телефонах, для большинства задач их хватает, специально устанавливать что-то
отдельное необязательно.

## Коротко

- Надёжность пароля определяет прежде всего длина. Замены вроде `a` → `@` почти
  ничего не дают, а разнообразие символов помогает, но обязательным требованием
  уже не считается.
- Минимум 15 символов по актуальному стандарту NIST SP 800-63B, для важных
  аккаунтов от 20.
- Никаких личных данных и цельных слов из словаря, их подбирают в первую
  очередь.
- Свой пароль на каждый сайт: доверьте генерацию инструменту, а не памяти.
- Генерируйте на чужом компьютере в режиме инкогнито, храните готовые пароли в
  менеджере паролей.

/tools/password-generator
