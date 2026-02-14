import { PdfIcon } from '../components/Icons';
import { COLORS, DATA, PAGES } from '../constants';
import './Pdfs.scss';
import TagSelector from '../components/Btns/TagSelector';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';
export default function Pdfs() {
	const navigate = useNavigate();
	const abrirPdf = (nombre: string) => {
		window.open(`/PDFS_DIAPOSITIVAS_CAMPUS/${nombre}.pdf`, '_blank', 'noopener,noreferrer');
	};

	const { currentColor, setCurrentColor, currentPage, setCurrentPage } = useAppContext();

	const handlePage = (id: string) => {
		setCurrentPage(id);
		navigate(id);
	};
	return (
		<div className='pdfs-container'>
			<div className='tags'>
				<TagSelector
					value={currentColor}
					options={COLORS}
					onChange={setCurrentColor}
				/>
				<TagSelector
					value={currentPage}
					options={PAGES}
					onChange={handlePage}
				/>
			</div>
			<div className='text'>
				<h2>Documentos PDF del curso</h2>
				<p>
					Accede a los documentos PDF de referencia del curso. Encuentra apuntes, guías y
					materiales organizados por tema para estudiar y complementar tu aprendizaje.
				</p>
			</div>
			<div className='grupo-pdfs'>
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
											key={pdf}
											onClick={() => abrirPdf(pdf)}
										>
											<PdfIcon />
											<p>{pdf}</p>
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
