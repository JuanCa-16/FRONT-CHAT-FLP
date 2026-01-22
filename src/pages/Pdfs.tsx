import { PdfIcon } from '../components/Icons';
import { COLORS, PAGES } from '../constants';
import './Pdfs.scss';
import TagSelector from '../components/Btns/TagSelector';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';
export default function Pdfs() {
	const PDFS = [
		'0. Introduccion e historia de los lenguajes de programacion',
		'0.1. Repaso gramaticas I',
		'1. La relacion entre la induccion y recursion Especificacion de datos',
		'2. Estrategias para representar datos',
		'3. Datatype y arboles de sintaxis abstracta',
		'4. Semantica de los lenguajes de programacion',
		'6. Procedimientos y procedimientos recursivos',
		'7. Asignacion y paso de parametros',
		'8. Chequeo de tipos',
		'9. Inferencia de tipos',
		'9.1. Ejemplos inferencia de tipos',
		'10. Objetos',
	];

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
			<h2>Pdfs del curso</h2>
			<div className='grupo-pdfs'>
				{PDFS.map((pdf) => (
					<div
						className='pdf'
						key={pdf}
						onClick={() => abrirPdf(pdf)}
					>
						<PdfIcon />
						<p>{pdf}</p>
					</div>
				))}
			</div>
		</div>
	);
}
