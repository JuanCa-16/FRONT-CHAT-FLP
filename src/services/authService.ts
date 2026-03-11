import api from './api';

// Definimos una interfaz para saber qué recibimos del backend
export interface AuthResponse {
	access_token: string;
	token_type: string;
	usuario: string;
	nombre: string;
}

export const authService = {
	login: async (usuario: string, contrasena: string): Promise<AuthResponse> => {
		const { data } = await api.post('/auth/login', { usuario, contrasena });
		return data;
	},

	register: async (nombre: string, usuario: string, contrasena: string): Promise<AuthResponse> => {
		const { data } = await api.post('/auth/registro', { nombre, usuario, contrasena });
		return data;
	},

	logout: () => {
		// El logout en JWT es simplemente borrar el rastro en el cliente
		localStorage.removeItem('token');
		localStorage.removeItem('user_name');
		localStorage.removeItem('user_handle');

		window.dispatchEvent(new Event('storage'));
	},
};
