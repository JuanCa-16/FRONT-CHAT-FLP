import { useEffect, useRef, useState } from 'react';
import Tag from '../components/Btns/Tag';
import InputChat from '../components/Inputs/InputChat';
import './Chat.css';
import Menu from '../components/Menu/Menu';
import type { MessageChat } from '../interfaces';
import Message from '../components/Inputs/Message';
import TypingIndicator from '../components/TypingIndicator';
import { COLORS, MODELS } from '../constants';

const Chat = () => {
	const [messages, setMessages] = useState<MessageChat[]>([]);
	const [isConversationStarted, setIsConversationStarted] = useState(false);
	const [currentModel, setCurrentModel] = useState('todo');
	const [isThinking, setIsThinking] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);

	const urlBack =
		window.location.hostname === 'localhost'
			? `http://localhost:8000/rag/responder/${currentModel}`
			: `https://flp-rag-gemini.onrender.com/rag/responder/${currentModel}`;

	const getHistorial = (messages: MessageChat[]) => {
		return messages
			.slice(-4) // últimos 4 previos
			.map((m) => ({
				role: m.role === 'assistant' ? 'model' : 'user',
				content: m.content,
			}));
	};

	const handleStartChat = async (message: string) => {
		const historial = getHistorial(messages);

		const userMessage: MessageChat = {
			id: Date.now().toString(),
			role: 'user',
			content: message,
		};

		setMessages([userMessage]);
		setIsConversationStarted(true);
		setIsThinking(true);

		try {
			const res = await fetch(urlBack, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					pregunta: message,
					top_n: 1,
					historial: historial,
				}),
			});

			const data = await res.json();

			const assistantMessage: MessageChat = {
				id: (Date.now() + 1).toString(),
				role: 'assistant',
				content: data.respuesta ?? 'No se recibió respuesta del servidor.',
				metadata: data.documentos_usados[0].metadata ?? 'Sin metadata.',
				similitud: data.documentos_usados[0].similitud,
			};

			setMessages((prev) => [...prev, assistantMessage]);
		} catch (error) {
			const assistantMessage: MessageChat = {
				id: (Date.now() + 2).toString(),
				role: 'assistant',
				content: 'Error al conectarse con el servidor.',
			};
			setMessages((prev) => [...prev, assistantMessage]);
			console.log(error);
		}

		setIsThinking(false);
	};

	const handleSendMessage = async (message: string) => {
		const historial = getHistorial(messages);

		const userMessage: MessageChat = {
			id: Date.now().toString(),
			role: 'user',
			content: message,
		};

		setMessages((prev) => [...prev, userMessage]);

		try {
			setIsThinking(true);
			const res = await fetch(urlBack, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					pregunta: message,
					top_n: 1,
					historial: historial,
				}),
			});

			const data = await res.json();

			const assistantMessage: MessageChat = {
				id: (Date.now() + 1).toString(),
				role: 'assistant',
				content: data.respuesta ?? 'No se recibió respuesta del servidor.',
				metadata: data.documentos_usados[0].metadata ?? 'Sin metadata.',
				similitud: data.documentos_usados[0].similitud,
			};

			setMessages((prev) => [...prev, assistantMessage]);
		} catch (error) {
			const assistantMessage: MessageChat = {
				id: (Date.now() + 2).toString(),
				role: 'assistant',
				content: 'Error al conectarse con el servidor.',
			};
			setMessages((prev) => [...prev, assistantMessage]);
			console.log(error);
		}

		setIsThinking(false);
	};

	const conversationRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = conversationRef.current;
		if (!el) return;

		el.scrollTo({
			top: el.scrollHeight,
			behavior: 'smooth',
		});
	}, [messages, isThinking]);

	const [currentColor, setCurrentColor] = useState('#e26821');
	const [colorOpen, setColorOpen] = useState(false);

	useEffect(() => {
		document.documentElement.style.setProperty('--color-primary', currentColor);
	}, [currentColor]);

	return (
		<div className='chat-container'>
			<div className='ellipse ellipse-1 ' />
			<div className='ellipse ellipse-2 ' />

			<div className='blur'>
				<div className='tags'>
					<Tag
						onOpenMenu={() => setMenuOpen(true)}
						option={MODELS.find((m) => m.id === currentModel)!}
					/>
					<Menu
						open={menuOpen}
						onClose={() => setMenuOpen(false)}
						currentModel={currentModel}
						onModelChange={setCurrentModel}
						option={MODELS}
					/>

					<Tag
						onOpenMenu={() => setColorOpen(true)}
						option={COLORS.find((c) => c.id === currentColor)!}
					/>
					<Menu
						open={colorOpen}
						onClose={() => setColorOpen(false)}
						currentModel={currentColor}
						onModelChange={setCurrentColor}
						option={COLORS}
					/>
				</div>
				{!isConversationStarted ? (
					<div className='chat welcome'>
						<h1>Asistente conversacional FLP</h1>
						<p className='text-muted-foreground text-base md:text-lg'>
							Inicia una conversación escribiendo tu mensaje
						</p>
					</div>
				) : (
					<div
						className='chat conversation'
						ref={conversationRef}
					>
						{messages.map((message) => (
							<Message
								key={message.id}
								role={message.role}
								content={message.content}
								metadata={message.metadata}
								similitud={message.similitud}
							/>
						))}

						{isThinking && <TypingIndicator />}
					</div>
				)}

				<InputChat
					onSendMessage={!isConversationStarted ? handleStartChat : handleSendMessage}
					placeholder='Pregunta lo que quieras a tu profe de FLP'
				/>
			</div>
		</div>
	);
};

export default Chat;
