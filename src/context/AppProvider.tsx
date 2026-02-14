import { useEffect, useState } from 'react';
import { AppContext } from './AppContext';

interface AppProviderProps {
	children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
	const [currentColor, setCurrentColor] = useState<string>(() => {
		return localStorage.getItem('chat-primary-color') ?? '#e26821';
	});

	const [currentPage, setCurrentPage] = useState<string>(window.location.pathname);

	useEffect(() => {
		document.documentElement.style.setProperty('--color-primary', currentColor);
		localStorage.setItem('chat-primary-color', currentColor);
	}, [currentColor]);

	useEffect(() => {
		localStorage.setItem('page', currentPage);
	}, [currentPage]);

	useEffect(() => {
		const handleLocationChange = () => {
			setCurrentPage(window.location.pathname);
		};

		// Escuchamos el evento de "atrás/adelante"
		window.addEventListener('popstate', handleLocationChange);

		return () => {
			window.removeEventListener('popstate', handleLocationChange);
		};
	}, []);

	return (
		<AppContext.Provider
			value={{
				currentColor,
				setCurrentColor,
				currentPage,
				setCurrentPage,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
