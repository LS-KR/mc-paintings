/*
 *  Copyright (C) 2024 James Thistlewood
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License along
 *  with this program; if not, write to the Free Software Foundation, Inc.,
 *  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import {
  MC_1_14_NAMES,
  MC_1_21_NAMES,
  BR_1_21_NAMES,
  SINGLE_TEX_POSITIONS,
  MAX_PACK_FORMAT,
  MAX_PACK_FORMAT_PRE_1_21,
} from './configs';
import { v4 as uuid } from 'uuid';
import defaultBedrockImage from './template_br.png';
import defaultJavaImage from './template_java.png';

function createNewImage(imageString) {
  return new Promise((resolve, reject) => {
    let imageObj = new Image();
    imageObj.src = imageString;
    imageObj.onload = () => {
      resolve(imageObj);
    };
  });
}

/**
 * Java file builder.
 *
 * Requires meta as:
 *    {
 *      format: Number,
 *      desc: String,
 *    }
 */
async function java_1_14(root, textureImages, meta) {
  return java_new_generic(root, textureImages, meta, MC_1_14_NAMES);
}

async function java_1_21(root, textureImages, meta) {
  return java_new_generic(root, textureImages, meta, MC_1_21_NAMES);
}

async function java_new_generic(root, textureImages, meta, names) {
  let min_format = meta.format;
  let max_format = meta.format;

  // Version 5 = 1.15, the first version to use multiple painting files.
  // (Well, actually, this was 1.14, but versioning was fucked - see configs.js.)
  // There were no changes to paintings in 1.15 - 1.20.6, but new paintings were
  // added in 1.21.
  if (meta.format >= 5 && meta.format <= MAX_PACK_FORMAT_PRE_1_21) {
    min_format = 5;
    max_format = MAX_PACK_FORMAT_PRE_1_21;
  } else if (meta.format > MAX_PACK_FORMAT_PRE_1_21) {
    min_format = MAX_PACK_FORMAT_PRE_1_21 + 1; // hack, but it works
    max_format = MAX_PACK_FORMAT;
  }

  root.file(
    'pack.mcmeta',
    JSON.stringify({
      pack: {
        pack_format: meta.format,
        description: meta.desc,
        // Since 1.20.2, this field is supported in the metadata. It should be
        // ignored by older versions.
        supported_formats: {
          min_inclusive: min_format,
          max_inclusive: max_format,
        },
      },
    })
  );
  let paintings = root.folder('assets/minecraft/textures/painting');

  let userPaintingsCount = 0;
  for (let size in textureImages) {
    let thisSize = textureImages[size];
    for (let i = 0; i < thisSize.length; i++) {
      // At this point the image is in jpeg format so convert
      // it to a png via a canvas.
      // SINCE 1.20.3, ONLY PNGs WORK!!!
      let jpegImage = thisSize[i];
      if (!jpegImage) continue;

      let imageObj = await createNewImage(jpegImage);

      let canvas = document.createElement('canvas');
      canvas.width = imageObj.naturalWidth;
      canvas.height = imageObj.naturalHeight;
      let context = canvas.getContext('2d');
      context.drawImage(imageObj, 0, 0);

      let imageString = canvas
        .toDataURL()
        .replace('data:image/png;base64,', '');
      paintings.file(`${names[size][i]}.png`, imageString, {
        base64: true,
      });
      userPaintingsCount += 1;
    }
  }
  return userPaintingsCount;
}

/**
 * For Minecraft versions which use a single texture to hold all painting textures.
 *
 * This is all Bedrock versions and Java versions up to and including 1.13.x.
 */
async function generalizedSingleTexture(meta, baseImage, textureImages) {
  const canvas = document.createElement('canvas');
  const blockPixels = meta.resolution;
  const fullSize = blockPixels * 16;
  canvas.width = fullSize;
  canvas.height = fullSize;
  const context = canvas.getContext('2d');

  context.imageSmoothingEnabled = false;
  context.drawImage(baseImage, 0, 0, fullSize, fullSize);
  context.imageSmoothingEnabled = true;

  let userPaintingsCount = 0;
  for (let size in textureImages) {
    let thisSize = textureImages[size];
    let sizeAndPositions = SINGLE_TEX_POSITIONS[size];
    for (let i = 0; i < thisSize.length; i++) {
      // At this point the image is in jpeg format so convert
      // it to a png via a canvas
      let jpegImage = thisSize[i];
      if (!jpegImage) continue;

      let imageObj = await createNewImage(jpegImage);

      let positionConfig = sizeAndPositions.positions[i];
      let sizeConfig = sizeAndPositions.size;

      context.drawImage(
        imageObj,
        positionConfig.x * blockPixels,
        positionConfig.y * blockPixels,
        sizeConfig.w * blockPixels,
        sizeConfig.h * blockPixels
      );

      userPaintingsCount += 1;
    }
  }

  let imageString = canvas.toDataURL().replace('data:image/png;base64,', '');
  return [imageString, userPaintingsCount];
}

/**
 * Bedrock file builder. Requires meta:
 *    {
 *      desc: String,
 *      name: String,
 *      resolution: Number,
 *      packFormat: [Number, Number, Number]
 *    }
 */
async function bedrock_1_21(root, textureImages, meta) {
  root.file(
    'manifest.json',
    JSON.stringify({
      format_version: 2,
      header: {
        description: meta.desc,
        name: `${meta.name}`,
        uuid: uuid(),
        version: [0, 0, 1],
        min_engine_version: meta.format,
      },
      modules: [
        {
          description: meta.desc,
          type: 'resources',
          uuid: uuid(), // yes this is supposed to be different from the one above
          version: [0, 0, 1],
        },
      ],
    })
  );

  // work out which to send to single texture
  const kzTextures = {};
  const otherTextures = {};
  for (let size in textureImages) {
    if (SINGLE_TEX_POSITIONS[size] === undefined) {
      otherTextures[size] = textureImages[size];
      continue;
    }

    const availableInKz = SINGLE_TEX_POSITIONS[size].positions.length;
    if (textureImages[size].length > availableInKz) {
      kzTextures[size] = textureImages[size].slice(0, availableInKz);
      otherTextures[size] = textureImages[size].slice(availableInKz);
    } else {
      kzTextures[size] = textureImages[size];
    }
  }

  // now do the single (kz) texture
  const paintingDir = root.folder('textures/painting');
  const baseImage = await createNewImage(defaultBedrockImage);
  let [imageString, userPaintingsCount] = await generalizedSingleTexture(
    meta,
    baseImage,
    kzTextures
  );

  paintingDir.file('kz.png', imageString, {
    base64: true,
  });

  // and do the other textures (copied from above, no shame)
  for (let size in otherTextures) {
    let thisSize = otherTextures[size];
    for (let i = 0; i < thisSize.length; i++) {
      // At this point the image is in jpeg format so convert
      // it to a png via a canvas.
      // SINCE 1.20.3, ONLY PNGs WORK!!!
      let jpegImage = thisSize[i];
      if (!jpegImage) continue;

      let imageObj = await createNewImage(jpegImage);

      let canvas = document.createElement('canvas');
      canvas.width = imageObj.naturalWidth;
      canvas.height = imageObj.naturalHeight;
      let context = canvas.getContext('2d');
      context.drawImage(imageObj, 0, 0);

      let imageString = canvas
        .toDataURL()
        .replace('data:image/png;base64,', '');
      paintingDir.file(`${BR_1_21_NAMES[size][i]}.png`, imageString, {
        base64: true,
      });
      userPaintingsCount += 1;
    }
  }

  return userPaintingsCount;
}

async function bedrock_1_14(root, textureImages, meta) {
  root.file(
    'manifest.json',
    JSON.stringify({
      format_version: 2,
      header: {
        description: meta.desc,
        name: `${meta.name}`,
        uuid: uuid(),
        version: [0, 0, 1],
        min_engine_version: meta.format,
      },
      modules: [
        {
          description: meta.desc,
          type: 'resources',
          uuid: uuid(), // yes this is supposed to be different from the one above
          version: [0, 0, 1],
        },
      ],
    })
  );

  const paintingDir = root.folder('textures/painting');
  const baseImage = await createNewImage(defaultBedrockImage);
  const [imageString, userPaintingsCount] = await generalizedSingleTexture(
    meta,
    baseImage,
    textureImages
  );

  paintingDir.file('kz.png', imageString, {
    base64: true,
  });

  return userPaintingsCount;
}

/**
 * Java file builder for versions < 1.14.
 *
 * Requires meta as:
 *    {
 *      format: Number,
 *      desc: String,
 *    }
 */
async function java_old(root, textureImages, meta) {
  root.file(
    'pack.mcmeta',
    JSON.stringify({
      pack: {
        pack_format: meta.format,
        description: meta.desc,
      },
    })
  );

  const paintingDir = root.folder('assets/minecraft/textures/painting');
  const baseImage = await createNewImage(defaultJavaImage);
  const [imageString, userPaintingsCount] = await generalizedSingleTexture(
    meta,
    baseImage,
    textureImages
  );

  paintingDir.file('paintings_kristoffer_zetterstrand.png', imageString, {
    base64: true,
  });

  return userPaintingsCount;
}

export default {
  java_1_14,
  java_1_21,
  java_old,
  bedrock_1_14,
  bedrock_1_21,
};
