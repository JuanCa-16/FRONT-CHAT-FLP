import { useNavigate } from 'react-router-dom';
import './Videos.scss';
import { useAppContext } from '../context/useAppContext';
import TagSelector from '../components/Btns/TagSelector';
import { COLORS, DATA, PAGES } from '../constants';

export default function Videos() {
	const navigate = useNavigate();

	const { currentColor, setCurrentColor, currentPage, setCurrentPage } = useAppContext();

	const handlePage = (id: string) => {
		setCurrentPage(id);
		navigate(id);
	};

	return (
		<div className='video-container'>
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
			<h2>Videos del curso</h2>
			<p>
				Explora todos los videos explicativos del curso, organizados por tema. Aprende a tu
				ritmo y repasa los conceptos clave con material audiovisual de apoyo.
			</p>
			<div className='grupo-videos'>
				{Object.entries(DATA).map(([key, value]) => (
					<div
						key={key}
						className='temas'
					>
						<h2>
							{parseInt(key) + 1}. {value.tematica}
						</h2>
						<ul className='video'>
							{value?.videos.length > 0 ? (
								value?.videos.map((video, idx) => {
									// Extraer el ID del video
									const videoId = video.split('v=')[1];
									const embedUrl = `https://www.youtube.com/embed/${videoId}`;

									return (
										<iframe
											key={idx}
											className='rounded'
											src={embedUrl}
											allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
											allowFullScreen
											loading='lazy'
											style={{
												width: '100%',
												aspectRatio: '16/9',
												borderRadius: '8px',
												border: 'none',
											}}
										/>
									);
								})
							) : (
								<p style={{ fontStyle: 'italic' }}>
									No hay videos disponibles para este tema.
								</p>
							)}
						</ul>
					</div>
				))}
			</div>
		</div>
	);
}
