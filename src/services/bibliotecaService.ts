import api from './api';

// Lo que enviamos al backend
export interface BibliotecaCreate {
	origen: string;
	documento_id: number;
	material_id?: number | null;
}

export interface BibliotecaResponse {
	id: number;
	usuario: string;
	origen: string;
	documento_id: number;
	material_id?: number | null;
	fecha_consulta: string;
}

export const bibliotecaService = {
	agregarABiblioteca: async (payload: BibliotecaCreate): Promise<BibliotecaResponse> => {
		const { data } = await api.post('/biblioteca/', payload);
		return data;
	},
};
