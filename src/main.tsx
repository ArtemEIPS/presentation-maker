import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import App from './App';
import store from './store/store';

const container = document.getElementById('root');
const root = createRoot(container!);

const savedEditor = localStorage.getItem('presentationEditor');
if (savedEditor) {
  try {
    const parsedEditor = JSON.parse(savedEditor);
    store.dispatch({ type: 'LOAD_EDITOR', payload: parsedEditor });
  } catch (error) {
    console.error('Error parsing editor data from local storage', error);
  }
}

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <App />
      </DndProvider>
    </Provider>
  </React.StrictMode>
);