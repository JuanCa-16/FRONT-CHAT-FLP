import axios from 'axios';

const urlBack =
	window.location.hostname === 'localhost' ? `http://localhost:8000` : `https://flp-rag-gemini-750647961146.us-east1.run.app`;

const api = axios.create({
	baseURL: urlBack,
	headers: { 'Content-Type': 'application/json' },
});

// Interceptor de PETICIÓN: Pone el token automáticamente
api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token && config.headers) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// Interceptor de RESPUESTA: Si el token vence (401), nos manda al login
api.interceptors.response.use(
	(res) => res,
	(error) => {
		if (error.response?.status === 401) {
			const token = localStorage.getItem('token');

			if (token) {
				localStorage.removeItem('token');
				localStorage.removeItem('user_name');
				localStorage.removeItem('user_handle');

				window.dispatchEvent(new Event('storage'));
			}
		}
		return Promise.reject(error);
	},
);

export default api;
