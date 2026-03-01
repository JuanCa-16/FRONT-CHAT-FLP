export interface Metadata {
	CORTE?: string;
	TEMATICA?: string;
	COMPETENCIA?: string;
	RESULTADO_APRENDIZAJE?: string;
	NIVEL_DIFICULTAD?: 'Baja' | 'Media' | 'Alta';
	FUENTE: 'VIDEO' | 'PDF' | 'CODIGO' | 'GIT';
	NOMBRE_DOCUMENTO: string;
	URL?: string;
}

export interface documents {
	id?: number;
	similitud: string;
	metadata: Metadata;
}

export interface MessageChat {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	documents?: documents[];
	tipo?: 'VIDEO' | 'PDF' | 'CODIGO' | 'GIT' | 'ALL';
	fecha_mensaje?: string;
}

export interface ChatMessageProps {
	role?: 'user' | 'assistant';
	content?: string;
	documents?: {
		similitud: string;
		metadata: Metadata;
	}[];
}

export interface TagOption {
	id: string;
	name: string;
	title: string;
	desc: string;
}
