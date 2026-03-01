import { useEffect, useState } from 'react';
import { AppContext } from './AppContext';
import { useLocation } from 'react-router-dom';

interface AppProviderProps {
	children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
	const location = useLocation();

	const [currentColor, setCurrentColor] = useState<string>(() => {
		return localStorage.getItem('chat-primary-color') ?? '#e26821';
	});

	const [currentPage, setCurrentPage] = useState<string>(
		location.pathname.startsWith('/chat') ? '/chat' : location.pathname,
	);

	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
		return !!localStorage.getItem('token');
	});

	const [userName, setUserName] = useState<string | null>(() => {
		return localStorage.getItem('user_name');
	});

	const [userHandle, setUserHandle] = useState<string | null>(() => {
		return localStorage.getItem('user_handle');
	});

	useEffect(() => {
		const syncAuth = () => {
			setIsAuthenticated(!!localStorage.getItem('token'));
			setUserName(localStorage.getItem('user_name'));
			setUserHandle(localStorage.getItem('user_handle'));
		};

		window.addEventListener('storage', syncAuth);
		return () => window.removeEventListener('storage', syncAuth);
	}, []);

	useEffect(() => {
		document.documentElement.style.setProperty('--color-primary', currentColor);
		localStorage.setItem('chat-primary-color', currentColor);
	}, [currentColor]);

	useEffect(() => {
		localStorage.setItem('page', currentPage);
	}, [currentPage]);

	useEffect(() => {
		const path = location.pathname;

		const handleLocationChange = () => {
			if (path.startsWith('/chat')) {
				setCurrentPage('/chat');
			} else {
				setCurrentPage(path);
			}
		};
		handleLocationChange();
	}, [location.pathname]);

	const [refreshChats, setRefreshChats] = useState(0);

	const triggerRefresh = () => {
		setRefreshChats((prev) => prev + 1);
	};

	const [activeChatId, setActiveChatId] = useState<number | null>(null);

	return (
		<AppContext.Provider
			value={{
				currentColor,
				setCurrentColor,
				currentPage,
				setCurrentPage,
				isAuthenticated,
				userName,
				userHandle,
				refreshChats,
				triggerRefresh,
				activeChatId,
				setActiveChatId,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
