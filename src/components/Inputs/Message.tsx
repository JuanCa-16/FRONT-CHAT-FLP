import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { cb } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './Message.scss';
import type { ChatMessageProps } from '../../interfaces';
import remarkBreaks from 'remark-breaks';
interface CodeComponentProps {
	node?: unknown;
	inline?: boolean;
	className?: string;
	children?: React.ReactNode;
}

export default function Message({ role, content, documents }: ChatMessageProps) {
	const isUser = role === 'user';

	const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

	const uniqueDocuments = documents?.filter((doc, index, self) => {
		const { similitud, metadata } = doc;
		
		// Solo considerar documentos con similitud >= 0.63
		if (Number(similitud) < 0.63) return false;

		// Buscar si ya existe un documento con el mismo recurso
		const isDuplicate = self.findIndex((d, i) => {
			if (i >= index) return false; // Solo comparar con anteriores
			
			const dMetadata = d.metadata;
			
			// Comparar por tipo de fuente y recurso específico
			if (metadata?.FUENTE === 'VIDEO' && dMetadata?.FUENTE === 'VIDEO') {
				return metadata?.LINK_VIDEO === dMetadata?.LINK_VIDEO;
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

	
	return (
		<div className={`message-container ${isUser ? '' : 'inverse'}`}>
			<div className='message'>
				<ReactMarkdown
					components={{
						code({ inline, className, children, ...props }: CodeComponentProps) {
							const match = /language-(\w+)/.exec(className || '');
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
					const rawLink = metadata?.LINK_VIDEO ?? null;

					const nombrePdf = metadata?.NOMBRE_DOCUMENTO ?? null;

					const linkVideo = rawLink ? rawLink.replace('watch?v=', 'embed/') : null;

					const showInfo = Number(similitud) >= 0.63;

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

							{metadata?.FUENTE == 'PDF' && showInfo && nombrePdf && (
								<>
									{!isMobile ? (
										<>
											<p>
												<br />
											</p>
											<iframe
												src={`/PDFS_DIAPOSITIVAS_CAMPUS/${nombrePdf}.pdf`}
												width='100%'
												height='600px'
												style={{
													border: 'none',
												}}
											/>
										</>
									) : (
										<a
											href={`/PDFS_DIAPOSITIVAS_CAMPUS/${nombrePdf}.pdf`}
											target='_blank'
											rel='noopener noreferrer'
											className='pdf-link'
											style={{
												color: 'var(--color-primary)',
												textDecoration: 'none',
											}}
										>
											Abrir PDF
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
											Ir al GitHub
										</a>
							)}
						</>
					);
				})}
			</div>
		</div>
	);
}
