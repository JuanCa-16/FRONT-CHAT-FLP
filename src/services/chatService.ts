import api from './api';

// Definimos una interfaz para saber qué recibimos del backend
export interface ChatResponse {
	titulo: string;
	id: number;
	usuario: string;
	fecha_creacion: string;
	fecha_actualizacion: string;
	total_mensajes?: number;
}

export const chatService = {
	newChat: async (titulo?: string): Promise<ChatResponse> => {
		const { data } = await api.post('/chat/', { titulo });
		return data;
	},
	misChats: async (): Promise<ChatResponse[]> => {
		const { data } = await api.get('/chat/mis-chats');
		return data;
	},
	deleteChat: async (id: number) => {
		await api.delete(`/chat/${id}`);
	},

	updateChat: async (id: number, titulo: string) => {
		const { data } = await api.put(`/chat/${id}`, { titulo });
		return data;
	},
};
