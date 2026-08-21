---
title: 'Контраст текста и фона: пороги WCAG и что придёт им на смену'
excerpt:
  'Сколько нужно контраста, чтобы пройти WCAG AA и AAA, почему формула иногда
  расходится с ощущением на глаз, и что происходит с APCA — алгоритмом, который
  должен был заменить действующий стандарт в WCAG 3, но пока не заменил. С живым
  чекером прямо в статье.'
date: '2026-07-25T14:00:00.000Z'
coverImage: '/images/blog/kontrast-teksta-i-fona.png'
author:
  name: Дмитрий Борисенко
  picture: '/images/avatar.jpeg'
related:
  - lighthouse-100
  - css-shadows
  - css-variables
---

Контраст текста и фона — не про «выглядит достаточно ярко». Это конкретный
коэффициент, который считается по формуле из яркости двух цветов, и пройти или
не пройти его можно только цифрой, а не взглядом.

## Пороги WCAG

Действующий стандарт — WCAG 2.2, он же основа большинства чек-листов по
доступности:

| Уровень       | Обычный текст | Крупный текст |
| ------------- | ------------- | ------------- |
| AA (минимум)  | 4.5:1         | 3:1           |
| AAA (строгий) | 7:1           | 4.5:1         |

Крупным считается текст от 24px обычного начертания или от 18.66px жирного —
буквы толще, глазу проще, поэтому порог ниже. Всё остальное — включая
плейсхолдеры в полях и подписи под иконками — обязано укладываться в 4.5:1, если
это не декоративный элемент.

Проверить свою пару цветов, не считая формулу в уме, можно в
[чекере контраста](/tools/color-contrast-checker) — а прямо здесь можно
прикинуть на глаз:

## Живой чекер контраста

```html:live
// title: Живой чекер контраста
// resultOnly
<div class="contrast-demo">
  <div class="contrast-demo__pickers">
    <label class="contrast-demo__picker">
      Текст
      <input type="color" id="fg" value="#2563eb" />
    </label>
    <label class="contrast-demo__picker">
      Фон
      <input type="color" id="bg" value="#ffffff" />
    </label>
  </div>

  <div id="preview" class="contrast-demo__preview">Пример текста Aa</div>

  <div class="contrast-demo__result">
    <div class="contrast-demo__result-row">
      <span>Коэффициент контрастности</span>
      <strong id="ratio">—</strong>
    </div>
    <div class="contrast-demo__result-row">
      <span>Обычный текст</span>
      <strong id="verdict-normal">—</strong>
    </div>
    <div class="contrast-demo__result-row">
      <span>Крупный текст</span>
      <strong id="verdict-large">—</strong>
    </div>
  </div>
</div>
```

```css:live
.contrast-demo {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 30rem;
}
.contrast-demo__pickers {
  display: flex;
  gap: 1.5rem;
}
.contrast-demo__picker {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.85rem;
  opacity: 0.85;
}
.contrast-demo__picker input[type='color'] {
  width: 2.4rem;
  height: 2.4rem;
  padding: 0;
  border: 1px solid rgba(128, 128, 128, 0.35);
  border-radius: 0.5rem;
  background: none;
  cursor: pointer;
}
.contrast-demo__preview {
  padding: 1.5rem;
  border-radius: 0.75rem;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  border: 1px solid rgba(128, 128, 128, 0.2);
}
.contrast-demo__result {
  padding: 0.9rem 1rem;
  border-radius: 0.75rem;
  background: rgba(128, 128, 128, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.contrast-demo__result-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.9rem;
}
.contrast-demo__result-row strong {
  font-variant-numeric: tabular-nums;
  text-align: right;
}
```

```js:live
function hexToRgb(hex) {
  var num = parseInt(hex.replace('#', ''), 16)
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
}

function relLuminance(rgb) {
  function chan(c) {
    var s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * chan(rgb.r) + 0.7152 * chan(rgb.g) + 0.0722 * chan(rgb.b)
}

function contrastRatio(hex1, hex2) {
  var l1 = relLuminance(hexToRgb(hex1))
  var l2 = relLuminance(hexToRgb(hex2))
  var lighter = Math.max(l1, l2)
  var darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

function verdict(ratio, aaThreshold, aaaThreshold) {
  var aa = ratio >= aaThreshold ? '✓ AA' : '✕ AA'
  var aaa = ratio >= aaaThreshold ? '✓ AAA' : '✕ AAA'
  return aa + ' · ' + aaa
}

function update() {
  var fg = document.getElementById('fg').value
  var bg = document.getElementById('bg').value
  var ratio = contrastRatio(fg, bg)

  var preview = document.getElementById('preview')
  preview.style.color = fg
  preview.style.background = bg

  document.getElementById('ratio').textContent = ratio.toFixed(2) + ':1'
  document.getElementById('verdict-normal').textContent = verdict(ratio, 4.5, 7)
  document.getElementById('verdict-large').textContent = verdict(ratio, 3, 4.5)
}

;['fg', 'bg'].forEach(function (id) {
  document.getElementById(id).addEventListener('input', update)
})

update()
```

Синий на белом по умолчанию проходит AA, но не дотягивает до AAA — попробуйте
затемнить синий (сдвиньте цвет ближе к чёрному) и посмотрите, с какого момента
загорится AAA.

## Почему формула иногда расходится с ощущением

Контраст — это отношение яркости, а не «разница цветов на глаз». Классическая
ловушка: жёлтый кажется ярким и заметным сам по себе, но белый текст на жёлтом
фоне почти нечитаем — их яркости слишком близки, и коэффициент проваливается до
1.5:1, хотя визуально жёлтый выглядит «контрастным» цветом. Формула WCAG 2.x
также известна тем, что недооценивает контраст на некоторых парах тёмных цветов
и переоценивает на некоторых светлых — отсюда родилась APCA.

## APCA и WCAG 3: что придёт на смену

APCA (Accessible Perceptual Contrast Algorithm) — альтернативная формула,
которая учитывает не только яркость, но и то, как человеческий глаз воспринимает
контраст в зависимости от размера и насыщенности шрифта. Её разрабатывали именно
как замену действующей формуле для готовящегося стандарта WCAG 3.

Разработчикам стоит знать: **APCA исключили из рабочего черновика WCAG 3 в 2023
году** — рабочая группа W3C не набрала достаточной поддержки для его принятия, и
алгоритм для WCAG 3 пока не определён. Сам WCAG 3 остаётся черновиком и вряд ли
станет финальным стандартом раньше 2030 года.

Практический вывод на сегодня: **ориентироваться нужно на WCAG 2.2** — это
единственный официально действующий стандарт, и именно его коэффициенты (4.5:1 /
3:1 / 7:1) проверяют Lighthouse, axe и другие аудиторы доступности. APCA можно
тестировать добровольно при обновлении дизайн-системы, но требованием он пока не
является нигде.

## При чём здесь SEO и Lighthouse

Контраст — один из аудитов категории Accessibility в
[Lighthouse](/blog/lighthouse-100), и здесь он не «мягкая рекомендация»:
проваленный контраст **гарантированно** снижает итоговый балл категории, в
отличие от многих других аудитов, которые засчитываются частично. Полноценный
балл 100 в Accessibility без прохождения контраста недостижим физически — это
один из немногих аудитов Lighthouse, которые нельзя обойти компромиссом.

## Коротко

- WCAG 2.2 (действующий стандарт): обычный текст — 4.5:1 (AA) / 7:1 (AAA),
  крупный — 3:1 / 4.5:1.
- Крупный текст — от 24px обычного начертания или 18.66px жирного.
- Контраст считают по формуле, а не на глаз: жёлтый на белом кажется ярким, но
  проваливает коэффициент.
- APCA — более точный алгоритм, готовился на замену для WCAG 3, но его исключили
  из черновика в 2023 году. Ориентир на сегодня — только WCAG 2.2.
- Lighthouse проверяет именно WCAG 2.2 и не даёт скидок на проваленный контраст.

/tools/color-contrast-checker
