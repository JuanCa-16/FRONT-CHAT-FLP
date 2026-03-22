import { useEffect, useState } from 'react';
import './Recomendaciones.scss';
import { recomendacionService, type RecomendacionesResponse } from '../services/recomendacion';
import Message from '../components/Inputs/Message';
import TopBar from '../components/TopBar/TopBar';
import type { Corpus } from '../interfaces';


const componentes = [
	{ id: 'perfil_final', titulo: 'Recomendado para ti' },
	{ id: 'implicito', titulo: 'Basado en tu historial' },
	{ id: 'reciente', titulo: 'Tus consultas recientes' },
	{ id: 'positivo', titulo: 'Lo que te gustó' },
] as const;

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

									
									const text = infoMaterial.contenido;
									
									
									const doc = {
										similitud: r.similitud,
										metadata: infoMaterial.metadata,
									};
									
									if (!agrupados.has(r.documento_id)) {
										agrupados.set(r.documento_id, {
											text,
											docs: [doc],
										});
									} else {
										const grupo = agrupados.get(
											r.documento_id,
										);
										grupo.texto += `\n\n${text}`;
										grupo.docs.push(doc);
									}
								});
								
								console.log('INFO',agrupados)
								return (
									<>
										<h2>{comp.titulo}</h2>

										{Array.from(agrupados.entries()).map(
											([docId, grupo]) => (
												<Message
													key={`${comp.id}-${docId}`}
													role='assistant'
													content={
														grupo.text
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
