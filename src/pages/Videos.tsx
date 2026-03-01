import { useNavigate } from 'react-router-dom';
import './Videos.scss';
import { useAppContext } from '../context/useAppContext';
import TagSelector from '../components/Btns/TagSelector';
import { COLORS, DATA, PAGES } from '../constants';
import { VideoPlayer } from '../components/VideoPlayer';

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

			<div className='grupo-videos'>
				<div className='text'>
					<h3>Videos del curso</h3>
					<p>
						Explora los videos del curso que explican cada tema de forma clara.
						Aprende a tu ritmo, repite lo que necesites y refuerza los conceptos
						clave con apoyo visual.
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
						<ul className='video'>
							{value?.videos.length > 0 ? (
								value?.videos.map((video) => {
									// Extraer el ID del video
									//const videoId = video.split('v=')[1];
									//const embedUrl = `https://www.youtube.com/embed/${videoId}`;

									return (
										// <iframe
										// 	key={idx}
										// 	className='rounded'
										// 	src={embedUrl}
										// 	loading='lazy'
										// 	allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
										// 	allowFullScreen
										// 	style={{
										// 		width: '100%',
										// 		aspectRatio: '16/9',
										// 		borderRadius: '8px',
										// 		border: 'none',
										// 	}}
										// />
										<VideoPlayer
											key={video.id}
											videoUrl={video.url}
											nombre={video.nombre}
											id={video.id}
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
