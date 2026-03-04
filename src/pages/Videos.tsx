import './Videos.scss';
import { DATA } from '../constants';
import { VideoPlayer } from '../components/VideoPlayer';
import TopBar from '../components/TopBar/TopBar';

export default function Videos() {
	return (
		<div className='video-container'>
			<TopBar
				color
				page
				model={false}
			/>

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
