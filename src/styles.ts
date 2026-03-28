export const ESC = "\x1B";
const OSC = "\x1B]";
const BEL = "\x07";

export const RESET = `${ESC}[0m`;
export const BOLD = `${ESC}[1m`;
export const DIM = `${ESC}[2m`;

const rgb = (r: number, g: number, b: number) => `${ESC}[38;2;${r};${g};${b}m`;

export const COLORS = {
  vue: rgb(66, 184, 131),
  vueDark: rgb(52, 152, 108),
  vueLight: rgb(100, 207, 159),
  cyan: rgb(0, 200, 220),
  orange: rgb(255, 160, 70),
  pink: rgb(255, 100, 150),
  purple: rgb(180, 120, 255),
  yellow: rgb(255, 215, 0),
  white: rgb(255, 255, 255),
  gray: rgb(150, 150, 150),
  darkGray: rgb(80, 80, 80),
  border: rgb(66, 184, 131),
};

const GRADIENT = [
  rgb(66, 184, 131),
  rgb(60, 170, 140),
  rgb(50, 160, 160),
  rgb(40, 150, 180),
  rgb(30, 140, 200),
  rgb(20, 130, 220),
  rgb(80, 120, 240),
  rgb(140, 110, 255),
];

export function gradientText(text: string): string {
  let result = "";

  for (let index = 0; index < text.length; index += 1) {
    const colorIndex = Math.floor((index / text.length) * GRADIENT.length);
    result += GRADIENT[colorIndex] + text[index];
  }

  return result + RESET;
}

export function link(url: string, text: string): string {
  return `${OSC}8;;${url}${BEL}${text}${OSC}8;;${BEL}`;
}
