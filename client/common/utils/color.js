const teamColors = [
  'red',
  'blue',
  'teal',
  'purple',
  'yellow',
  'orange',
  'green',
  'pink',
  'gray',
  'light-blue',
  'dark-green',
  'brown',
  'maroon',
  'navy',
  'turquoise',
  'violet',
  'wheat',
  'peach',
  'mint',
  'lavender',
  'coal',
  'snow',
  'emerald',
  'peanut'
];

export function teamToColorName(team) {
  return team < teamColors.length
    ? teamColors[team]
    : 'black';
}
