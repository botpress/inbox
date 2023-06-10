import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Toaster } from 'react-hot-toast';
import './styles/tailwind-input.css';

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Dashboard />} />
				<Route path="*" element={<div>Num achei</div>} />
			</Routes>
			<Toaster />
		</BrowserRouter>
	);
}
