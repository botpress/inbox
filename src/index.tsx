import App from './App';
import { createRoot } from 'react-dom/client';

// import Modal from 'react-modal';

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)

const container = document.getElementById('app');

// Modal.setAppElement(container!);
const root = createRoot(container!);

root.render(<App />);
