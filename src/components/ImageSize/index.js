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

import React from 'react';
import {
  c_ACTION,
  c_HIGHLIGHT,
  c_ACTIVE,
  c_PRIMARY,
  c_BLANK,
  c_BLANK_HIGHLIGHT,
  c_BLANK_ACTIVE,
} from '../../theme';

const BASE_SIZE = 3; // rem

function dimensionsFromSize(size) {
  return size.split('x').map((val) => parseInt(val));
}

const ImageSelect = ({ image, size, index, onSelect, isSelected }) => {
  const [width, height] = dimensionsFromSize(size);

  const onClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onSelect(size, index);
  };

  return (
    <div
      className={`imageSelect ${isSelected ? ' selected' : ''}`}
      onClick={onClick}
    >
      {image && <img src={image} alt={`Size ${size} number ${index + 1}`} />}
      <style jsx>{`
        .imageSelect,
        img {
          width: ${BASE_SIZE * width}rem;
          height: ${BASE_SIZE * height}rem;
        }

        .imageSelect {
          flex-grow: 0;
          margin: 0.25rem;
          background: ${image ? 'none' : c_BLANK};
          transition: all 0.2s;
        }

        .imageSelect:hover {
          background: ${image ? 'none' : c_BLANK_HIGHLIGHT};
        }

        .imageSelect.selected {
          outline: 3px solid ${c_BLANK_ACTIVE};
        }
      `}</style>
    </div>
  );
};

const ImageSize = ({
  size,
  images,
  isExpanded,
  onClick,
  onImageSelect,
  hasSelected,
}) => {
  const [width, height] = dimensionsFromSize(size);

  const handleClick = () => onClick(size);

  const handleClose = () => onClick(null);

  return (
    <div className="imageSize" onClick={handleClick}>
      {size}
      <div className="expandedMenu" onClick={handleClose}>
        <div className="closeBtn">X</div>
        <div className="sizes">
          {images.map((image, index) => (
            <ImageSelect
              size={size}
              index={index}
              image={image}
              onSelect={onImageSelect}
              isSelected={hasSelected === index}
              key={index}
            />
          ))}
        </div>
      </div>
      <style jsx>{`
        .imageSize {
          position: relative;
          display: inline-block;
          background: ${c_ACTION};
          width: ${BASE_SIZE * width}rem;
          height: ${BASE_SIZE * height}rem;
          text-align: center;
          line-height: ${BASE_SIZE * height}rem;
          font-weight: ${typeof hasSelected === 'number' ? 'bold' : 'normal'};
          transition: background 0.2s;
          margin: 0.25rem;
        }

        .imageSize:hover {
          background: ${c_HIGHLIGHT};
        }

        .expandedMenu {
          display: ${isExpanded ? 'block' : 'none'};
          width: ${BASE_SIZE * 10}rem;
          border: 1px solid ${c_PRIMARY};
          background: ${c_ACTIVE};
          position: absolute;
          z-index: 10;
          border-radius: 0.25rem;
          top: 0;
          left: 0;
          padding: 0.5rem;
        }

        .sizes {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-evenly;
        }

        .closeBtn {
          width: 100%;
          height: 1.5rem;
          line-height: 1.5rem;
          font-weight: bold;
          text-align: right;
        }
      `}</style>
    </div>
  );
};

export default ImageSize;
