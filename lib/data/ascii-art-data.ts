export interface AsciiPattern {
  id: string
  name: string
  pattern: string
  category: string
  width?: number
  height?: number
}

export const asciiPatterns: AsciiPattern[] = [
  // Emotions
  {
    id: 'smile',
    name: 'Smile',
    pattern: `
    .-""""""-.
  .'          '.
 /   O      O   \\
:                :
|                |
:    .------.    :
 \\  '        '  /
  '.  '----'  .'
    '-......-'`,
    category: 'emotions',
    width: 18,
    height: 9
  },
  {
    id: 'heart',
    name: 'Heart',
    pattern: `
  .-""""""-.  .-""""""-.
 /          \\/          \\
|            |            |
|            |            |
 \\          /\\          /
  '-.    .-'  '-.    .-'
    \\  /        \\  /
     \\/          \\/`,
    category: 'emotions',
    width: 28,
    height: 8
  },
  {
    id: 'sad',
    name: 'Sad Face',
    pattern: `
    .-""""""-.
  .'          '.
 /   O      O   \\
:                :
|                |
:      ____      :
 \\   .'    '.   /
  '.'        '.'
    '-......-'`,
    category: 'emotions',
    width: 18,
    height: 9
  },
  // Animals
  {
    id: 'cat',
    name: 'Cat',
    pattern: `
      /\\_/\\  
     ( o.o ) 
      > ^ <`,
    category: 'animals',
    width: 13,
    height: 3
  },
  {
    id: 'dog',
    name: 'Dog',
    pattern: `
     __
    (_\\.-.
     \\d  |
      ]  /
     /  \\ 
    L    L`,
    category: 'animals',
    width: 10,
    height: 6
  },
  {
    id: 'rabbit',
    name: 'Rabbit',
    pattern: `
     (\\__/)
     ( o.o)
     (")_(")`,
    category: 'animals',
    width: 12,
    height: 3
  },
  {
    id: 'bear',
    name: 'Bear',
    pattern: `
     .--.              .--.
    : (\\ ". _......_ ." /) :
     '.    \`        \`    .'
      /'   _        _   \`\\
     /     0}      {0     \\
    |       /      \\       |
    |     /'        \`\\     |
     \\   | .  .==.  . |   /
      '._ \\.' \\__/ './ _.'
      /  \`\`'._-''-_.''\`\`  \\`,
    category: 'animals',
    width: 28,
    height: 10
  },
  // Objects
  {
    id: 'coffee',
    name: 'Coffee Cup',
    pattern: `
     ( (
      ) )
    ........
    |      |]
    \\      /
     \`----'`,
    category: 'objects',
    width: 12,
    height: 6
  },
  {
    id: 'computer',
    name: 'Computer',
    pattern: `
    .--.
   |o_o |
   |:_/ |
  //   \\ \\
 (|     | )
/'|_   _|'\\
\\___)=(___/`,
    category: 'objects',
    width: 12,
    height: 7
  },
  {
    id: 'house',
    name: 'House',
    pattern: `
      __
     /  \\
    /    \\
   /______\\
   |  __  |
   | |  | |
   |_|__|_|`,
    category: 'objects',
    width: 11,
    height: 7
  },
  // Nature
  {
    id: 'tree',
    name: 'Tree',
    pattern: `
       &&& &&  & &&
      && &\\/&\\|& ()|/ @, &&
      &\\/(/&/&||/& /_/)_&/_&
   &() &\\/&|()|/&\\/ '%' & ()
  &_\\_&&_\\ |& |&&/&__%_/_& &&
&&   && & &| &| /& & % ()& /&&
 ()&_---()&\\&\\|&&-&&--%---()~
     &&     \\|||
             |||
             |||
             |||
       , -=-~  .-^- _`,
    category: 'nature',
    width: 30,
    height: 12
  },
  {
    id: 'sun',
    name: 'Sun',
    pattern: `
       \\   /
        .-.
   --- (   ) ---
        \`-\`
       /   \\`,
    category: 'nature',
    width: 16,
    height: 5
  },
  {
    id: 'moon',
    name: 'Moon',
    pattern: `
       _.._
     .' .-'\`
    /  /
    |  |
    \\  \\
     '. '._
       '--'`,
    category: 'nature',
    width: 12,
    height: 7
  },
  // Tech
  {
    id: 'robot',
    name: 'Robot',
    pattern: `
     ___
    |o o|
    |_-_|
  /|[o]|\\
 / | | | \\
   d   b`,
    category: 'tech',
    width: 11,
    height: 6
  },
  {
    id: 'rocket',
    name: 'Rocket',
    pattern: `
       /\\
      /  \\
     |    |
     | [] |
     |    |
     |    |
    /|/||\\|\\
   /_||||||_\\
     ######
      ####`,
    category: 'tech',
    width: 13,
    height: 10
  }
]

export const asciiCategories = {
  emotions: 'Emotions',
  animals: 'Animals',
  objects: 'Objects',
  nature: 'Nature',
  tech: 'Technology'
} as const

export const asciiCharsets = {
  basic: ' .:-=+*#%@',
  extended: ' .\`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
  blocks: ' ░▒▓█',
  dots: ' ⠁⠂⠄⡀⡁⡂⡄⣀⣁⣂⣄⣿',
  simple: ' .oO#',
  binary: ' 01'
} as const

export type AsciiCharset = keyof typeof asciiCharsets