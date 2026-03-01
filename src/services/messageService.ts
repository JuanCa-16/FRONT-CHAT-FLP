import type { MessageChat } from '../interfaces';
import api from './api';

export interface HistorialChatResponse {
	chat_id: number;
	titulo: string;
	total_mensajes: number;
	historial: MessageChat[];
}

export const MessageService = {
	getHistorial: async (chatId: number): Promise<HistorialChatResponse> => {
		const { data } = await api.get(`/mensaje/chat/${chatId}/historial`);
		return data;
	},
};
