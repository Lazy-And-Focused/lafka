import type { NextFont } from 'next/dist/compiled/@next/font';
import { Spectral, Prata, Overpass } from 'next/font/google';

/**
 * For Headlines, Headings and Titles
 */
const spectral = Spectral({
  weight: '400',
  style: 'normal',
  subsets: ['cyrillic', 'latin'],
});

/**
 * For ... idk
 */
const prata = Prata({
  weight: '400',
  style: 'normal',
  subsets: ['cyrillic', 'latin'],
});

const overpass = Overpass({
  style: ['normal', 'italic'],
  subsets: ['cyrillic', 'latin'],
});

export default function loaded() {
  const fonts: { [key: string]: NextFont } = { spectral, prata, overpass };

  return fonts;
}
