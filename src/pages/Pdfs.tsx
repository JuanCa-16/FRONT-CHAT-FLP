import { PdfIcon } from '../components/Icons';
import { DATA } from '../constants';
import './Pdfs.scss';
import { bibliotecaService, type BibliotecaCreate } from '../services/bibliotecaService';
import TopBar from '../components/TopBar/TopBar';
export default function Pdfs() {
	const abrirPdf = (nombre: string) => {
		window.open(`/PDFS_DIAPOSITIVAS_CAMPUS/${nombre}.pdf`, '_blank', 'noopener,noreferrer');
	};

	const agregarABiblioteca = async (payload: BibliotecaCreate) => {
		try {
			await bibliotecaService.agregarABiblioteca(payload);
		} catch (e) {
			console.error(e);
		}
	};
	return (
		<div className='pdfs-container'>
			<TopBar
				color
				page
				model={false}
			/>
			<div className='grupo-pdfs'>
				<div className='text'>
					<h3>Documentos PDF del curso</h3>
					<p>
						Accede a los PDFs del curso con apuntes, guías y recursos por tema.
						Refuerza tu aprendizaje y profundiza en cada concepto para avanzar en tu
						dominio del contenido.
					</p>
				</div>
				{Object.entries(DATA).map(([key, value]) => (
					<div
						key={key}
						className='temas'
					>
						<h2>
							{parseInt(key) + 1}. {value.tematica}
						</h2>
						<ul className='pdfs'>
							{value?.pdfs.length > 0 ? (
								value?.pdfs.map((pdf) => {
									return (
										<div
											className='pdf'
											key={pdf.id}
											onClick={() => {
												abrirPdf(pdf.nombre);

												// Guardar en biblioteca silenciosamente
												agregarABiblioteca({
													origen: 'PDF',
													documento_id:
														Number(
															pdf.id,
														),
												});
											}}
										>
											<PdfIcon />
											<p>{pdf.nombre}</p>
										</div>
									);
								})
							) : (
								<p style={{ fontStyle: 'italic' }}>
									No hay material disponibles para este tema.
								</p>
							)}
						</ul>
					</div>
				))}
			</div>
		</div>
	);
}
