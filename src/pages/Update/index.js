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

// most of the links on this page are trustworthy
/* eslint-disable react/jsx-no-target-blank */

import React from 'react';
import Layout, { Column } from '../../components/Layout';
import { KOFI, FEEDBACK, TWITTER } from '../../supportLinks.json';
import Button from '../../components/Button';

function About(props) {
  return (
    <Layout>
      <Column>
        <div className="content">
          <h1>Minecraft 1.21</h1>

          <p className="date">14 May, 2024</p>

          <p>Greetings, MC-painter.</p>

          <p>
            You may already know that{' '}
            <a href="https://minecraft.wiki/w/Tricky_Trials" target="_blank">
              Minecraft 1.21
            </a>{' '}
            is in development, with a release date estimated for June this year.
            You may also already know that this update adds loads more paintings
            (good), but also changes the way paintings work internally (bad).
          </p>

          <p>
            To make it short: getting MCPaintings to support the new paintings
            added by 1.21 will require a fair amount of work from me. But
            getting it to support the full potential of 1.21, which allows an
            essentially infinite number of paintings, is much more difficult. To
            do this would basically require me to redesign and rebuild the
            website, from the ground up.
          </p>

          <p>
            The good news is that I plan on doing exactly this. I've wanted to
            add more features to this website for a while. Imagine if you could
            use gifs or videos as painting textures, pixelize your images, add
            borders and frames, or even add your own music discs... There's also
            a ton of QoL improvements I want to make (better previews, smoother
            UX, saving work-in-progress, editing existing resource packs). And
            for anyone interested in the technical details, I'd like to do it
            all in Svelte.
          </p>

          <p>
            The bad news: I have my final university exams in three weeks' time.
            I can absolutely not start any work on this until my exams are over,
            which will be around the start of June, likely giving me a very
            short timeframe to build a whole website. For this reason, there may
            be a significant gap between 1.21 releasing and MCPaintings updating
            to support it. Please bear with me.
          </p>

          <p>
            As always, you can send messages of support/suggestions/hate mail to
            me{' '}
            <a href={FEEDBACK} target="_blank">
              via the feedback form
            </a>
            , or chip in to support my work{' '}
            <a href={KOFI} target="_blank">
              over at Kofi
            </a>
            . Whatever you do, I appreciate it.
          </p>

          <p>
            Thanks for using mcpaintings!{' '}
            <a href={TWITTER} target="_blank">
              Stay tuned.
            </a>
          </p>

          <p className="backbtn">
            <Button internal="/">Back to the homepage</Button>
          </p>
        </div>
      </Column>
      <style jsx>{`
        .content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
          text-align: justify;
          padding-bottom: 4rem;
          color: #eee;
        }

        .date {
          color: #ccc;
          font-style: italic;
          font-size: 1rem;
        }

        .backbtn {
          margin-top: 3rem;
        }

        p {
          font-size: 1.2rem;
          line-height: 1.7rem;
        }

        h1 {
          text-align: center;
          margin-top: 4rem;
        }

        h1:nth-child(1) {
          margin-top: 2rem;
        }

        a {
          color: white;
        }
      `}</style>
    </Layout>
  );
}

export default About;
