import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { cb } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './Message.scss';
import type { ChatMessageProps } from '../../interfaces';
import remarkBreaks from 'remark-breaks';
import IconBtn from '../Btns/IconBtn';
import { GitIcon, PdfIcon, ThumbsDownIcon, ThumbsUpIcon } from '../Icons';
import { MessageService } from '../../services/messageService';
import { useState } from 'react';
import MermaidDiagram from './Mermaid';
interface CodeComponentProps {
	node?: unknown;
	inline?: boolean;
	className?: string;
	children?: React.ReactNode;
}

export default function Message({ role, content, documents, calificacion, id }: ChatMessageProps) {
	const isUser = role === 'user';

	const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

	const uniqueDocuments =
		documents?.filter((doc, index, self) => {
			const { similitud, metadata } = doc;

			// Solo considerar documentos con similitud >= 0.63
			if (Number(similitud) < 0.6) return false;

			// Buscar si ya existe un documento con el mismo recurso
			const isDuplicate =
				self.findIndex((d, i) => {
					if (i >= index) return false; // Solo comparar con anteriores

					const dMetadata = d.metadata;

					// Comparar por tipo de fuente y recurso específico
					if (metadata?.FUENTE === 'VIDEO' && dMetadata?.FUENTE === 'VIDEO') {
						return metadata?.URL === dMetadata?.URL;
					}

					if (metadata?.FUENTE === 'PDF' && dMetadata?.FUENTE === 'PDF') {
						return metadata?.NOMBRE_DOCUMENTO === dMetadata?.NOMBRE_DOCUMENTO;
					}

					if (metadata?.FUENTE === 'GIT' && dMetadata?.FUENTE === 'GIT') {
						return metadata?.URL === dMetadata?.URL;
					}

					return false;
				}) !== -1;

			return !isDuplicate;
		}) ?? [];

	const [nota, setNota] = useState<number | null>(calificacion ?? null);
	const [loading, setLoading] = useState(false);
	const calificar = async (value: number, e: React.MouseEvent<HTMLButtonElement>) => {
		if (id == null || loading) return;

		e.currentTarget.blur();

		const previous = nota;

		const next = previous === value ? null : value;

		setNota(next);

		try {
			setLoading(true);
			const data = await MessageService.calificar(id, { calificacion: value });

			setNota(data.calificacion);
		} catch (error) {
			console.error(error);
			setNota(previous);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={`message-container ${isUser ? '' : 'inverse'}`}>
			<div className='message'>
				<ReactMarkdown
					components={{
						code({ inline, className, children, ...props }: CodeComponentProps) {
							const match = /language-(\w+)/.exec(className || '');
							const language = match ? match[1] : '';

							// Si es mermaid, renderizar con el componente especial
							if (!inline && language === 'mermaid') {
								return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
							}

							return !inline && match ? (
								<SyntaxHighlighter
									remarkPlugins={[remarkBreaks]}
									style={cb}
									language={match[1]}
									PreTag='div'
									showLineNumbers
									wrapLongLines={true}
									lineProps={{
										style: { wordBreak: 'break-word' },
									}}
									className='code-block'
									{...props}
								>
									{String(children).replace(/\n$/, '')}
								</SyntaxHighlighter>
							) : (
								<code {...props}>{children}</code>
							);
						},
					}}
				>
					{content}
				</ReactMarkdown>

				{uniqueDocuments?.map(({ similitud, metadata }) => {
					const rawLink = metadata?.LINK_VIDEO
						? metadata?.LINK_VIDEO
						: (metadata?.URL ?? null);

					const nombre = metadata?.NOMBRE_DOCUMENTO ?? null;

					const partes = nombre.split('_');
					const nombreGit = partes.length > 1 ? partes[1] : '';

					const linkVideo = rawLink ? rawLink.replace('watch?v=', 'embed/') : null;

					const showInfo = Number(similitud) >= 0.6;

					const url = metadata?.URL;

					return (
						<>
							{metadata?.FUENTE == 'VIDEO' && showInfo && linkVideo && (
								<>
									<p>
										<br />
									</p>
									<iframe
										className='rounded'
										src={linkVideo}
										allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
										allowFullScreen
										style={{
											width: '100%',
											aspectRatio: '16/9',
											borderRadius: '8px',
											border: 'none',
										}}
									/>
								</>
							)}

							{metadata?.FUENTE == 'PDF' && showInfo && nombre && (
								<>
									{!isMobile ? (
										<>
											<p>
												<br />
											</p>
											<iframe
												src={`/PDFS_DIAPOSITIVAS_CAMPUS/${nombre}.pdf`}
												width='100%'
												height='600px'
												style={{
													border: 'none',
												}}
											/>
										</>
									) : (
										<a
											href={`/PDFS_DIAPOSITIVAS_CAMPUS/${nombre}.pdf`}
											target='_blank'
											rel='noopener noreferrer'
											className='pdf-link'
											style={{
												color: 'var(--color-primary)',
												textDecoration: 'none',
											}}
										>
											<PdfIcon />
											<p>{nombre}.</p>
										</a>
									)}
								</>
							)}

							{metadata?.FUENTE == 'GIT' && showInfo && url && (
								<a
									href={url}
									target='_blank'
									rel='noopener noreferrer'
									className='pdf-link'
									style={{
										color: 'var(--color-primary)',
										textDecoration: 'none',
									}}
								>
									<GitIcon />
									{nombreGit && <p>{nombreGit}.</p>}
								</a>
							)}
						</>
					);
				})}

				{!isUser && id && (
					<div className='btns-calificacion'>
						<p>Calificar respuesta:</p>
						<button
							className={`btn ${loading ? 'disabled' : ''}`}
							style={{ pointerEvents: loading ? 'none' : 'auto' }}
							onClick={(e) => {
								if (!loading) calificar(5, e);
								e.currentTarget.blur();
							}}
							onTouchEnd={(e) => e.currentTarget.blur()}
							type='button'
						>
							<IconBtn
								className={nota == 5 ? 'on' : 'off'}
								Icon={<ThumbsUpIcon />}
							/>
						</button>
						<button
							className={`btn ${loading ? 'disabled' : ''}`}
							style={{ pointerEvents: loading ? 'none' : 'auto' }}
							onClick={(e) => {
								if (!loading) calificar(1, e);
								e.currentTarget.blur();
							}}
							onTouchEnd={(e) => e.currentTarget.blur()}
							type='button'
						>
							<IconBtn
								className={nota == 1 ? 'on' : 'off'}
								Icon={<ThumbsDownIcon />}
							/>
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
