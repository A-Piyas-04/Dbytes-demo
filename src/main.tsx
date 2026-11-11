import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/anek-bangla/standard.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/600.css';
import './styles/base.css';
import './styles/components.css';
import './styles/screens.css';
import App from './App';
import { StoreProvider } from './store';

createRoot(document.getElementById('root')!).render(
  <StoreProvider>
    <App />
  </StoreProvider>,
);
