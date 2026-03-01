import { GitIcon } from '../components/Icons';
import { COLORS, DATA, PAGES } from '../constants';
import './Git.scss';
import TagSelector from '../components/Btns/TagSelector';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';
import { bibliotecaService, type BibliotecaCreate } from '../services/bibliotecaService';

export default function Git() {
	const navigate = useNavigate();

	const { currentColor, setCurrentColor, currentPage, setCurrentPage } = useAppContext();

	const handlePage = (id: string) => {
		setCurrentPage(id);
		navigate(id);
	};

	const agregarABiblioteca = async (payload: BibliotecaCreate) => {
		try {
			await bibliotecaService.agregarABiblioteca(payload);
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<div className='gits-container'>
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
			<div className='grupo-gits'>
				<div className='text'>
					<h3>Documentos GIT del curso</h3>
					<p>
						Consulta los documentos GIT del curso con ejemplos y recursos por tema.
						Complementa tus estudios y familiarízate con las herramientas esenciales
						del desarrollo.
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
						<ul className='gits'>
							{value?.git.length > 0 ? (
								value?.git.map((git) => {
									const partes = git.nombre.split('_');
									const nombre =
										partes.length > 1 ? partes[1] : '';

									return (
										<div
											className='git'
											key={git.id}
											onClick={() => {
												// Abrir en nueva ventana
												window.open(
													git.url,
													'_blank',
													'noopener,noreferrer',
												);

												// Guardar en biblioteca silenciosamente
												agregarABiblioteca({
													origen: 'GIT',
													documento_id:
														Number(
															git.id,
														),
												});
											}}
										>
											<GitIcon />
											<p>{nombre}</p>
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
