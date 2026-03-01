import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AppProvider } from './context/AppProvider.tsx';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<div className='ellipse ellipse-1 ' />
		<div className='ellipse ellipse-2 ' />
		<div className='fondo'>
			<BrowserRouter>
				<AppProvider>
					<App />
				</AppProvider>
			</BrowserRouter>
		</div>
	</StrictMode>,
);
