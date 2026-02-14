import { useEffect, useRef, useState } from 'react';

import InputChat from '../components/Inputs/InputChat';
import './Chat.css';

import type { MessageChat } from '../interfaces';
import Message from '../components/Inputs/Message';
import TypingIndicator from '../components/TypingIndicator';
import { COLORS, MODELS, PAGES } from '../constants';
import TagSelector from '../components/Btns/TagSelector';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';

const Chat = () => {
	const [messages, setMessages] = useState<MessageChat[]>([]);
	const [isConversationStarted, setIsConversationStarted] = useState(false);
	const [currentModel, setCurrentModel] = useState('todo');
	const [isThinking, setIsThinking] = useState(false);
	const navigate = useNavigate();
	const { currentColor, setCurrentColor, currentPage, setCurrentPage } = useAppContext();

	const urlBack =
		window.location.hostname === 'localhost'
			? `http://localhost:8000/rag/responder/${currentModel}`
			: `https://flp-rag-gemini-1.onrender.com/rag/responder/${currentModel}`;

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
					top_n: 2,
					historial: historial,
				}),
			});

			const data = await res.json();

			const assistantMessage: MessageChat = {
				id: (Date.now() + 1).toString(),
				role: 'assistant',
				content: data.respuesta ?? 'No se recibió respuesta del servidor.',
				documents: data.documentos_usados,
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
					top_n: 2,
					historial: historial,
				}),
			});

			const data = await res.json();

			const assistantMessage: MessageChat = {
				id: (Date.now() + 1).toString(),
				role: 'assistant',
				content: data.respuesta ?? 'No se recibió respuesta del servidor.',
				documents: data.documentos_usados,
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

	const handlePage = (id: string) => {
		setCurrentPage(id);
		navigate(id);
	};

	return (
		<div className='chat-container'>
			<div className='fondo-chat'>
				<div className='tags'>
					<TagSelector
						value={currentModel}
						options={MODELS}
						onChange={setCurrentModel}
					/>

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
				{!isConversationStarted ? (
					<div className='chat welcome'>
						<h1>Bienvenido Estudiante !</h1>
						<p className='text-muted-foreground text-base md:text-lg'>
							Inicia una conversación con tu{' '}
							<strong>Asistente conversacional FLP</strong> escribiendo tu
							mensaje.
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
								documents = {message.documents}
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
