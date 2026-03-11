import { useEffect, useState } from 'react';
import './Recomendaciones.scss';
import { recomendacionService, type RecomendacionesResponse } from '../services/recomendacion';
import Message from '../components/Inputs/Message';
import TopBar from '../components/TopBar/TopBar';
import type { Corpus } from '../interfaces';

function marcarPalabras(texto: string, palabras: string[]) {
	const regex = new RegExp(`\\b(${palabras.join('|')})\\b`, 'gi');
	return texto.replace(regex, '`$1`');
}

const componentes = [
	{ id: 'perfil_final', titulo: 'Recomendado para ti' },
	{ id: 'implicito', titulo: 'Basado en tu historial' },
	{ id: 'reciente', titulo: 'Tus consultas recientes' },
	{ id: 'positivo', titulo: 'Lo que te gustó' },
] as const;

function agregarLenguajeRacket(texto: string): string {
	return texto.replace(/```(\s*\n)/g, (match, salto, offset, str) => {
		const antes = str.slice(0, offset);
		const lineaAnterior = antes.split('\n').pop();

		// Si la línea anterior ya tenía ``` con lenguaje, no tocar
		if (lineaAnterior && lineaAnterior.startsWith('```') && lineaAnterior.length > 3) {
			return match;
		}

		return '```racket' + salto;
	});
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
