import { createContext } from 'react';

export interface AppContextType {
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
}

export const AppContext = createContext<AppContextType | null>(null);
