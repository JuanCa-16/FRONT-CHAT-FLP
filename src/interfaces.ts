export interface Metadata {
	CORTE?: string;
	TEMATICA?: string;
	COMPETENCIA?: string;
	RESULTADO_APRENDIZAJE?: string;
	NIVEL_DIFICULTAD?: 'Baja' | 'Media' | 'Alta';
	FUENTE: 'VIDEO' | 'PDF' | 'CODIGO' | 'GIT';
	NOMBRE_DOCUMENTO: string;
	URL?: string;
	LINK_VIDEO?: string;
	codigo?:string;
}

export interface CorpusItem {
	id: number;
	tipo: string;
	contenido:string;
	metadata:Metadata;
	palabras_clave:string[];
	titulo: string;
}

export type Corpus = Record<number, CorpusItem>

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
	calificacion?: number;
}

export interface ChatMessageProps {
	role?: 'user' | 'assistant';
	content?: string;
	documents?: {
		similitud: string;
		metadata: Metadata;
	}[];
	id?: number;
	calificacion?: number;
}

export interface TagOption {
	id: string;
	name: string;
	title: string;
	desc: string;
}
