/*
 *  Copyright (C) 2022 James Thistlewood
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

/**
 * Number of paintings for each size.
 */
const SIZES_1_14 = {
  '1x1': 7,
  '1x2': 2,
  '2x1': 5,
  '2x2': 6,
  '4x2': 1,
  '4x3': 2,
  '4x4': 3,
};

const SIZES_1_21 = {
  '1x1': 8,
  '1x2': 3,
  '2x1': 5,
  '2x2': 8,
  '3x3': 8,
  '3x4': 2,
  '4x2': 5,
  '4x3': 2,
  '4x4': 5,
};

/**
 * Names of the individual files from 1.14 onwards.
 */
const MC_1_14_NAMES = {
  '1x1': ['alban', 'aztec', 'aztec2', 'bomb', 'kebab', 'plant', 'wasteland'],
  '1x2': ['graham', 'wanderer'],
  '2x1': ['courbet', 'creebet', 'pool', 'sea', 'sunset'],
  '2x2': ['bust', 'match', 'skull_and_roses', 'stage', 'void', 'wither'],
  '4x2': ['fighters'],
  '4x3': ['donkey_kong', 'skeleton'],
  '4x4': ['burning_skull', 'pigscene', 'pointer'],
};

const MC_1_21_NAMES = {
  '1x1': [
    'alban',
    'aztec',
    'aztec2',
    'bomb',
    'kebab',
    'meditative',
    'plant',
    'wasteland',
  ],
  '1x2': ['graham', 'prairie_ride', 'wanderer'],
  '2x1': ['courbet', 'creebet', 'pool', 'sea', 'sunset'],
  '2x2': [
    'baroque',
    'bust',
    'humble',
    'match',
    'skull_and_roses',
    'stage',
    'void',
    'wither',
  ],
  '3x3': [
    'bouquet',
    'cavebird',
    'cotan',
    'endboss',
    'fern',
    'owlemons',
    'sunflowers',
    'tides',
  ],
  '3x4': ['backyard', 'pond'],
  '4x2': ['changing', 'fighters', 'finding', 'lowmist', 'passage'],
  '4x3': ['donkey_kong', 'skeleton'],
  '4x4': ['burning_skull', 'orb', 'pigscene', 'pointer', 'unpacked'],
};

const BR_1_21_NAMES = {
  '1x1': ['meditative'],
  '1x2': ['prairie_ride'],
  '2x2': ['baroque', 'humble'],
  '3x3': [
    'bouquet',
    'cavebird',
    'cotan',
    'endboss',
    'fern',
    'owlemons',
    'sunflowers',
    'tides',
  ],
  '3x4': ['backyard', 'pond'],
  '4x2': ['changing', 'finding', 'lowmist', 'passage'],
  '4x4': ['orb', 'unpacked'],
};

/**
 * Helper function to construct version information object.
 *
 * packFormat is the raw value of the pack_format key in the mcmeta.
 * class is:
 *   - 1 for new Java format (separate file for each painting)
 *   - 2 for current Bedrock format (single texture for all paintings)
 *   - 3 for old Java format (single texture for all paintings)
 *   - 4 for 1.21 Java format (new paintings)
 *   - 5 for 1.21 Bedrock format (new paintings, but still using kz for some)
 */
const _v = (f, c) => ({
  packFormat: f,
  class: c,
});

/**
 * Some information about minecraft pack_format values:
 *   - pack_format is a resource pack version number first introduced in 1.6.
 *   - It is incremented arbitrarily by Mojang.
 *   - Since 1.20.2, the exact number is not needed and a range of values can be specified.
 *     This means that adding a new version (if it does not touch paintings) is as simple as
 *     updating the MAX_PACK_FORMAT variable to the latest number at https://minecraft.wiki/w/Pack_format.
 *   - Are you actually adding a new version? Remember to update defaultMeta.js. (Also, fix whatever has
 *     broken!) You'll also need to come up with a smarter solution than MAX_PACK_FORMAT.
 *     - note to self: the 'smarter solution' is apparently having two MAX_PACK_FORMATs.
 */
const MAX_PACK_FORMAT = 34;
const MAX_PACK_FORMAT_PRE_1_21 = 32;
const VERSION_MAP = {
  '1_21': _v(34, 4),
  '1_20_2': _v(18, 1),
  '1_20': _v(15, 1),
  '1_19_4': _v(13, 1),
  '1_19_3': _v(12, 1),
  '1_19': _v(9, 1),
  '1_18': _v(8, 1),
  '1_17': _v(7, 1),
  '1_16': _v(6, 1),
  '1_15': _v(5, 1),
  '1_14': _v(4, 1), // Yes, 1.14 and 1.13 share a version number despite having completely
  '1_13': _v(4, 3), // different painting formats. How crazy is that?
  '1_11': _v(3, 3),
  '1_9': _v(2, 3),
  '1_6': _v(1, 3),
  BR_1_21: _v([1, 21, 0], 5),
  BR_1_14: _v([1, 14, 0], 2),
};

const _p = (x, y) => {
  return { x, y };
};

const _s = (w, h) => {
  return { w, h };
};

// positions and sizes are defined as number of blocks - pixel size depends on the resolution chosen
const SINGLE_TEX_POSITIONS = {
  '1x1': {
    size: _s(1, 1),
    positions: [
      _p(0, 0),
      _p(1, 0),
      _p(2, 0),
      _p(3, 0),
      _p(4, 0),
      _p(5, 0),
      _p(6, 0),
    ],
  },
  '1x2': { size: _s(1, 2), positions: [_p(0, 4), _p(1, 4)] },
  '2x1': {
    size: _s(2, 1),
    positions: [_p(0, 2), _p(2, 2), _p(4, 2), _p(6, 2), _p(8, 2)],
  },
  '2x2': {
    size: _s(2, 2),
    positions: [_p(0, 8), _p(2, 8), _p(4, 8), _p(6, 8), _p(8, 8), _p(10, 8)],
  },
  '4x2': { size: _s(4, 2), positions: [_p(0, 6)] },
  '4x3': { size: _s(4, 3), positions: [_p(12, 4), _p(12, 7)] },
  '4x4': { size: _s(4, 4), positions: [_p(0, 12), _p(4, 12), _p(8, 12)] },
};

export {
  SIZES_1_21,
  SIZES_1_14,
  MC_1_14_NAMES,
  MC_1_21_NAMES,
  BR_1_21_NAMES,
  SINGLE_TEX_POSITIONS,
  VERSION_MAP,
  MAX_PACK_FORMAT,
  MAX_PACK_FORMAT_PRE_1_21,
};
