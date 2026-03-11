import { useEffect, useState } from 'react';
import './Recomendaciones.scss';
import { recomendacionService, type RecomendacionesResponse } from '../services/recomendacion';
import Message from '../components/Inputs/Message';
import TopBar from '../components/TopBar/TopBar';
import type { Corpus } from '../interfaces';

function marcarPalabras(texto: string, palabras: string[]) {
	// Dividir por bloques de código (incluyendo bloques inline con backticks simples)
	const partes = texto.split(/(```[\w]*\n[\s\S]*?```|`[^`\n]+`)/g);
	
	return partes.map((parte) => {
		// Si es un bloque de código (triple backtick) o código inline (backtick simple), NO marcar
		if (parte.startsWith('```') || parte.startsWith('`')) {
			return parte;
		}
		// Si es texto normal, marcar palabras clave
		const regex = new RegExp(`\\b(${palabras.join('|')})\\b`, 'gi');
		return parte.replace(regex, '`$1`');
	}).join('');
}

const componentes = [
	{ id: 'perfil_final', titulo: 'Recomendado para ti' },
	{ id: 'implicito', titulo: 'Basado en tu historial' },
	{ id: 'reciente', titulo: 'Tus consultas recientes' },
	{ id: 'positivo', titulo: 'Lo que te gustó' },
] as const;

function agregarLenguajeRacket(texto: string): string {
	// Primero, encontrar todos los bloques de código con triple backtick
	const bloques: Array<{ inicio: number; fin: number; lenguaje: string | null }> = [];
	const regex = /```(\w*)\n/g;
	let match;
	
	// Identificar todos los bloques de código
	while ((match = regex.exec(texto)) !== null) {
		const lenguaje = match[1] || null;
		const inicioBloque = match.index;
		
		// Buscar el cierre del bloque
		const cierreRegex = /```/g;
		cierreRegex.lastIndex = match.index + match[0].length;
		const cierreMatch = cierreRegex.exec(texto);
		
		if (cierreMatch) {
			bloques.push({
				inicio: inicioBloque,
				fin: cierreMatch.index + 3,
				lenguaje,
			});
			regex.lastIndex = cierreMatch.index + 3;
		}
	}
	
	// Procesar el texto de atrás hacia adelante para no afectar los índices
	let resultado = texto;
	for (let i = bloques.length - 1; i >= 0; i--) {
		const bloque = bloques[i];
		
		// Si el bloque no tiene lenguaje (es null o vacío), agregar "racket"
		if (!bloque.lenguaje) {
			const antes = resultado.substring(0, bloque.inicio);
			const bloqueTexto = resultado.substring(bloque.inicio, bloque.fin);
			const despues = resultado.substring(bloque.fin);
			
			// Reemplazar ``` por ```racket solo en la apertura
			const bloqueModificado = bloqueTexto.replace(/```\n/, '```racket\n');
			resultado = antes + bloqueModificado + despues;
		}
	}
	
	return resultado;
}


export default function Recomendaciones() {
	const [corpus, setCorpus] = useState<Corpus>();
	const [recomendaciones, setRecomendaciones] = useState<RecomendacionesResponse | null>(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		async function cargar() {
			const res = await fetch('/corpus.json');
			const data = await res.json();
			setCorpus(data);
		}

		cargar();
	}, []);

	useEffect(() => {
		async function cargarRecomendaciones() {
			const data = await recomendacionService.obtenerRecomendaciones(3);
			setRecomendaciones(data);
			setLoading(false);
		}

		cargarRecomendaciones();
	}, []);

	return (
		<div className='recomendacionesContainer'>
			<TopBar
				color
				page
				model={false}
			/>
			{loading ? (
				<p className='recomendaciones' style={{ fontStyle: 'italic' }}>Cargando...</p>
			) : (
				<div className='recomendaciones'>
					{recomendaciones && corpus &&
						(recomendaciones.modo === 'cold_start' ? (
							<p style={{ fontStyle: 'italic' }}>
								Sin datos para recomendarte. Realiza una consulta en el Chat primero.
							</p>
						) : (
							componentes.map((comp) => {
								const materiales =
									recomendaciones.recomendaciones_por_componente[
										comp.id
									].materiales;

								const agrupados = new Map();

								materiales.forEach((r) => {
									const infoMaterial = corpus[r.material_id];
									if (!infoMaterial) return;

									let contenido =
										r.fuente === 'CODIGO'
											? infoMaterial.contenido
													.split(/\.+/)
													.slice(2)
													.join('.')
											: infoMaterial.contenido;

									if (r.fuente === 'GIT') {
										contenido =
											agregarLenguajeRacket(
												contenido,
											);
									}

									let texto = marcarPalabras(
										contenido,
										infoMaterial.palabras_clave,
									);

									if (r.fuente === 'CODIGO') {
										texto += `

\`\`\`racket
${infoMaterial.metadata.codigo}
\`\`\`
`;
									}

									const doc = {
										similitud: r.similitud,
										metadata: infoMaterial.metadata,
									};

									if (!agrupados.has(r.documento_id)) {
										agrupados.set(r.documento_id, {
											texto,
											docs: [doc],
										});
									} else {
										const grupo = agrupados.get(
											r.documento_id,
										);
										grupo.texto += `\n\n${texto}`;
										grupo.docs.push(doc);
									}
								});

								return (
									<>
										<h2>{comp.titulo}</h2>

										{Array.from(agrupados.entries()).map(
											([docId, grupo]) => (
												<Message
													key={`${comp.id}-${docId}`}
													role='assistant'
													content={
														grupo.texto
													}
													documents={
														grupo.docs
													}
												/>
											),
										)}
									</>
								);
							})
						))}
				</div>
			)}
		</div>
	);
}
