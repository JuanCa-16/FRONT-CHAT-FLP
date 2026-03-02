import type { MessageChat } from '../interfaces';
import api from './api';

export interface HistorialChatResponse {
	chat_id: number;
	titulo: string;
	total_mensajes: number;
	historial: MessageChat[];
}

export interface CalificarResponse {
	mensaje_id: number;
	calificacion: number | null;
}

export const MessageService = {
	getHistorial: async (chatId: number): Promise<HistorialChatResponse> => {
		const { data } = await api.get(`/mensaje/chat/${chatId}/historial`);
		return data;
	},
	calificar: async (
		mensajeId: number,
		body: {
			calificacion: number | null;
		},
	): Promise<CalificarResponse> => {
		const { data } = await api.put(`/mensaje/respuesta/${mensajeId}/calificar`, body);
		return data;
	},
};
