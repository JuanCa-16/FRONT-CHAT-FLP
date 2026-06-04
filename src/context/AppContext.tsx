import { createContext } from 'react';

export interface AppContextType {
	currentModel: string;
	setCurrentModel: (page: string) => void;

	currentColor: string;
	setCurrentColor: (color: string) => void;

	currentPage: string;
	setCurrentPage: (page: string) => void;

	isAuthenticated: boolean;
	userName: string | null;
	userHandle: string | null;

	activeChatId: number | null;
	setActiveChatId: React.Dispatch<React.SetStateAction<number | null>>;

	refreshChats: number;
	triggerRefresh: () => void;

	open: boolean;
	setOpen: (page: boolean) => void;

	theme: 'light' | 'dark';
	toggleTheme: () => void;
}

export const AppContext = createContext<AppContextType | null>(null);
