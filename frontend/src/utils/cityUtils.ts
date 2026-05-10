const CITY_ALIASES = [
  ['கொடுமுடி', 'Kodumudi'],
  ['சாலைப்புதூர்', 'Salaipudur', 'Saalai Pudur', 'Solaipudur'],
  ['ஒத்தக்கடை', 'Othakadai', 'Otthakadai'],
  ['சிவகிரி', 'Sivagiri'],
  ['தாமரைபாளையம்', 'Thamaraipalayam', 'Thamarai Palayam'],
  ['ஊஞ்சலூர்', 'Oonjalur', 'Unjalur', 'Oonjallur'],
];

export function normalizeCityName(value: string | null | undefined): string {
  const city = String(value ?? '').trim();
  if (!city) {
    return '';
  }

  const normalizedCity = city.toLocaleLowerCase('en-IN');
  const aliasGroup = CITY_ALIASES.find((aliases) =>
    aliases.some((alias) => alias.toLocaleLowerCase('en-IN') === normalizedCity)
  );

  return aliasGroup?.[0] ?? city;
}
