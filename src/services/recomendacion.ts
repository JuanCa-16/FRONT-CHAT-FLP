import api from './api';

interface Material {
	material_id: number;
	documento_id: number;
	nombre_documento: string;
	fuente: string;
	url: string;
	tematica: string | null;
	competencia: string | null;
	nivel_dificultad: string | null;
	distancia_coseno: number;
	similitud: number;
	score_porcentaje: number;
	es_nuevo: boolean;
}

interface ComponenteRecomendacion {
	componente: string;
	disponible: boolean;
	total_materiales?: number;
	materiales_excluidos?: number;
	materiales: Material[];
}

export interface RecomendacionesResponse {
	username: string;
	top_k: number;
    modo?: string

	filtros_aplicados: {
		fuente: string | null;
		nivel_dificultad: string | null;
	};

	estadisticas_perfil: {
		items_implicitos: number;
		items_explicitos: number;
		preguntas: number;
		positivos: number;
		negativos: number;
	};

	recomendaciones_por_componente: {
		perfil_final: ComponenteRecomendacion;
		implicito: ComponenteRecomendacion;
		reciente: ComponenteRecomendacion;
		positivo: ComponenteRecomendacion;
	};
}

interface RecomendacionParams {
	top_k?: number;
	fuente?: string;
	nivel_dificultad?: string;
}

export const recomendacionService = {
	obtenerRecomendaciones: async (
		top_k: number = 2,
		fuente?: string,
		nivel_dificultad?: string,
	): Promise<RecomendacionesResponse> => {
		const params: RecomendacionParams = { top_k };

		if (fuente) params.fuente = fuente;
		if (nivel_dificultad) params.nivel_dificultad = nivel_dificultad;

		const { data } = await api.get('/recomendar/materiales-por-componente', {
			params,
		});

		return data;
	},
};
