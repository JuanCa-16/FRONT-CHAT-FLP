import { useEffect, useRef, useState } from 'react';

import InputChat from '../components/Inputs/InputChat';
import './Chat.css';
import axios from 'axios';

import type { MessageChat } from '../interfaces';
import Message from '../components/Inputs/Message';
import TypingIndicator from '../components/TypingIndicator';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';
import { useParams } from 'react-router-dom';
import { MessageService } from '../services/messageService';
import { chatService } from '../services/chatService';
import toast from 'react-hot-toast';
import TopBar from '../components/TopBar/TopBar';

const buildChatTitle = (text: string) => {
	const clean = text.trim();

	if (!clean) return 'Nuevo Chat';

	let result: string;

	if (clean.length <= 15) {
		result = clean;
	} else {
		const cut = clean.slice(0, 15);

		if (cut.endsWith(' ')) {
			result = cut.trim();
		} else if (clean[15] === ' ') {
			result = cut;
		} else {
			result = cut + '...';
		}
	}

	return result.charAt(0).toUpperCase() + result.slice(1);
};

const Chat = () => {
	const [messages, setMessages] = useState<MessageChat[]>([]);
	const [isConversationStarted, setIsConversationStarted] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [isThinking, setIsThinking] = useState(false);

	const navigate = useNavigate();

	const { currentModel, isAuthenticated, userHandle, triggerRefresh, setActiveChatId, activeChatId } =
		useAppContext();

	const url = isAuthenticated ? 'chat' : 'responder';
	const authToken = localStorage.getItem('token');

	const urlBack =
		window.location.hostname === 'localhost'
			? `http://localhost:8000/rag/${url}/${currentModel}`
			: `https://flp-rag-gemini-750647961146.us-east1.run.app/rag/${url}/${currentModel}`;

	// PARA INICIO SESION
	const { id } = useParams<{ id?: string }>();

	console.log('idd', id, messages, isConversationStarted, activeChatId);

	useEffect(() => {
		// Cleanup function que se ejecuta cuando el componente se desmonta
		return () => {
			setActiveChatId(null);
		};
	}, [setActiveChatId]);

	useEffect(() => {
		if (!id) {
			setMessages([]);
			setIsConversationStarted(false);
			setActiveChatId(null);
			setIsThinking(false);
			return;
		}

		const parsedId = Number(id);

		if (isNaN(parsedId) || parsedId <= 0) {
			// id inválido
			navigate('/chat', { replace: true });
			return;
		}

		setActiveChatId(parsedId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	useEffect(() => {
		if (!isAuthenticated || !activeChatId || !id) return;

		const fetchHistorial = async () => {
			try {
				setLoading(true);
				const response = await MessageService.getHistorial(activeChatId);
				setMessages(response.historial);
				if (response.historial.length > 0) {
					setIsConversationStarted(true);
				} else {
					setIsConversationStarted(false);
				}
			} catch (err) {
				if (axios.isAxiosError(err)) {
					const message = err.response?.data?.detail || 'Error en las credenciales';
					toast.error(message);
					navigate(`/chat`, { replace: true });
				} else {
					toast.error('Ocurrió un error inesperado al cargar el chat');
				}
			} finally {
				setLoading(false);
			}
		};

		fetchHistorial();
	}, [activeChatId, isAuthenticated, navigate, id]);

	//----------------------------------------
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

		let chatId = activeChatId;
		try {
			if (isAuthenticated && !chatId) {
				const chatTitle = buildChatTitle(message);
				const newChat = await chatService.newChat(chatTitle);
				chatId = newChat.id;
				setActiveChatId(newChat.id);
				triggerRefresh();

				window.history.replaceState(null, '', `/chat/${chatId}`);
			}

			const res = await fetch(urlBack, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
				},
				body: JSON.stringify({
					pregunta: message,
					top_n: 2,
					historial: historial,
					...(isAuthenticated && chatId ? { chat_id: Number(chatId) } : {}),
				}),
			});

			const data = await res.json();

			const assistantMessage: MessageChat = {
				id: isAuthenticated ? String(data.mensaje_respuesta_id) : (Date.now() + 1).toString(),
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
			console.error(error);
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
				headers: {
					'Content-Type': 'application/json',
					...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
				},
				body: JSON.stringify({
					pregunta: message,
					top_n: 2,
					historial: historial,
					...(isAuthenticated && activeChatId ? { chat_id: Number(activeChatId) } : {}),
				}),
			});

			const data = await res.json();

			const assistantMessage: MessageChat = {
				id: isAuthenticated ? String(data.mensaje_respuesta_id) : (Date.now() + 1).toString(),
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
			console.error(error);
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

	return (
		<div
			className='chat-container'
			key={activeChatId}
		>
			<div className='fondo-chat'>
				<TopBar
					model
					color
					page
				/>
				{isLoading && <TypingIndicator />}
				{!isLoading && !isConversationStarted ? (
					<div className='chat welcome'>
						{isAuthenticated ? (
							<h1>
								Hola{' '}
								<span style={{ color: 'var(--color-primary)' }}>
									{userHandle}!
								</span>
							</h1>
						) : (
							<h1>Bienvenido Estudiante !</h1>
						)}
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
						{!isLoading &&
							messages.map((message) => (
								<Message
									key={message.id}
									id={Number(message.id)}
									role={message.role}
									content={message.content}
									documents={message.documents}
									calificacion={message.calificacion}
								/>
							))}
						{isThinking && <TypingIndicator />}
					</div>
				)}

				<InputChat
					onSendMessage={!isConversationStarted ? handleStartChat : handleSendMessage}
					isThinking={isThinking}
					placeholder='Pregunta lo que quieras a tu profe de FLP'
				/>
			</div>
		</div>
	);
};

export default Chat;
