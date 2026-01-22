import { createContext } from 'react';

export interface AppContextType {
	currentColor: string;
	setCurrentColor: (color: string) => void;

	currentPage: string;
	setCurrentPage: (page: string) => void;
}

export const AppContext = createContext<AppContextType | null>(null);
