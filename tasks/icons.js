// utility packages
const fs = require('fs-extra');
const glob = require('fast-glob');
const ora = require('ora');
const path = require('path');

// icon packages
const SVGO = require('svgo');
const svgstore = require('svgstore');

// internal
const { SVGOSettings } = require('./utils');

const SVGOInstance = new SVGO({
  plugins: SVGOSettings,
});

const addSprite = async (currentSVG, spriteInstance) => {
  // filename
  const svgFilename = path.basename(currentSVG, path.extname(currentSVG));

  // extract svg contents
  const svgContents = fs.readFileSync(currentSVG, 'utf-8');

  // use SVGO to optimize contents string
  const optimized = await SVGOInstance.optimize(svgContents, {
    path: currentSVG,
  });

  // clean original file
  await fs.writeFileSync(currentSVG, optimized.data, 'utf-8');

  try {
    // add to optimized to sprite instance
    spriteInstance.add(svgFilename, optimized.data);
  } catch (e) {
    throw e;
  }
  return svgFilename;
};

const processSVGs = async dirMap => {
  const input = dirMap.in;

  let svgs = input;

  // check if a whole directory is passed
  if (typeof input === 'string') {
    svgs = await glob(`${dirMap.in}*.svg`);
  }

  // create a new svgstore instance
  const sprites = svgstore();

  // loop through each icon and compile sprite
  const compileSprite = await Promise.all(
    svgs.map(svg => addSprite(svg, sprites))
  );

  // create svg element out of new sprite
  const svg = sprites.toString({ inline: true });

  // write sprite to dir
  try {
    await fs.outputFile(dirMap.out, svg);
  } catch (err) {
    console.error(err);
  }
  return `${dirMap.in} => ${dirMap.out}`;
};

module.exports = async mappedIcons => {
  const spinner = ora('Building sprites').start();

  return await Promise.all(mappedIcons.map(dirMap => processSVGs(dirMap))).then(
    resp => {
      spinner.succeed();
      return resp;
    }
  );
};
