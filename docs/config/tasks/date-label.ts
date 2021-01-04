import { docsImages } from '../paths';
import { downloadAsset } from './utils';

const { createCanvas, Image, registerFont } = require('canvas');
const fs = require('fs-extra');
const ora = require('ora');
const path = require('path');

const bugHeight = 70;
const bugWidth = 60;
const bug = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 174.9 200" width="${bugWidth}" height="${bugHeight}"><path fill="#ffc200" d="M0 0v200l40.2-25.1h134.6V0H0zm125.2 139.7l-38.3-25.2-38.3 25.2 12.1-44.2L25 66.8l45.8-2.1L87 21.8l16.2 42.9 45.8 2.1-35.8 28.6 12 44.3z"/></svg>`;

interface Label {
  year: Number;
  imagePath: string;
}

const labelDir = path.join(docsImages, 'date-labels', '/');

async function initFonts(): Promise<any> {
  // remote fonts must be downloaded
  // https://github.com/Automattic/node-canvas/issues/1527
  const fontPath = await downloadAsset(
    'https://s3.amazonaws.com/cdn.texastribune.org/fonts/OpenSans-Bold.ttf',
    'fonts/OpenSans-Bold.ttf'
  );
  registerFont(fontPath, {
    family: 'Open Sans Bold',
  });
}

async function createLabels(year: Number): Promise<Label> {
  const width = 330;
  const height = 90;

  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');
  context.fillStyle = '#222';
  context.fillRect(0, 0, width, height);
  context.font = 'bold 32px Open Sans Bold';
  context.fillStyle = '#fff';
  const text = `Published ${year}`;
  context.textBaseline = 'middle';
  context.textAlign = 'left';
  context.fillText(text, bugWidth + 20, canvas.height / 2);

  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${bug}`;
  context.drawImage(img, 10, canvas.height / 2 - bugHeight / 2);
  const buffer = canvas.toBuffer('image/png');
  const imagePath = `${labelDir}${year}.png`;
  fs.outputFile(imagePath, buffer);
  return {
    year,
    imagePath,
  };
}

async function build() {
  const spinner = ora('Generating date labels').start();
  // download and register CDN fonts
  await initFonts();
  const now = new Date().getUTCFullYear();
  const years = Array(now - 1998)
    .fill('')
    .map((v, idx) => now - idx) as Array<number>;
  const labels = await Promise.all(
    years.map((year: Number) => createLabels(year))
  );
  spinner.succeed();
  return labels;
}

build().catch((err) => {
  // eslint-disable-next-line no-console
  console.log(err);
  process.exit(1);
});
