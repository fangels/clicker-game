import React from 'react';
import { createRoot } from 'react-dom/client';
import '@clicker-game/ui-kit/tokens.css';
import { GameRoot } from './GameRoot.js';
import helloWorld from './game/index.js';

const container = document.getElementById('root');
if (!container) throw new Error('Root container missing');

createRoot(container).render(
  <React.StrictMode>
    <GameRoot definition={helloWorld} />
  </React.StrictMode>,
);
