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
import InfoPopup from '../InfoPopup';
import Button from '../Button';

const Warning = ({ children, onAccept, onReject }) => {
  return (
    <InfoPopup warning onReject={onReject}>
      {children}
      <div className="buttonContainer">
        <Button onClick={onReject}>Go back</Button>
        <Button scheme={'red'} onClick={onAccept}>
          Continue anyway
        </Button>
      </div>
      <style jsx>{`
        .buttonContainer {
          display: flex;
          justify-content: space-evenly;
          flex-wrap: wrap;
          margin-top: 3rem;
        }
      `}</style>
    </InfoPopup>
  );
};

export default Warning;
