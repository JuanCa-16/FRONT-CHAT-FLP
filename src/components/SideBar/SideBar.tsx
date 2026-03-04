import './SideBar.scss';
import { useEffect, useState } from 'react';
import { ExitIcon, MenuIcon, PlusIcon } from '../Icons';
import SideBarItem from './SideBarItem';
import { authService } from '../../services/authService';
import { chatService } from '../../services/chatService';
import type { ChatResponse } from '../../services/chatService';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/useAppContext';
import toast from 'react-hot-toast';

export default function SideBar() {
	const [chats, setChats] = useState<ChatResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadingCreate, setLoadingCreate] = useState(false);

	const { isAuthenticated, refreshChats, setActiveChatId, activeChatId } = useAppContext();
	useEffect(() => {
		if (!isAuthenticated) return;
		const fetchChats = async () => {
			try {
				if (chats.length === 0) {
					setLoading(true);
				}
				const data = await chatService.misChats();
				setChats(data);
			} catch (err) {
				if (axios.isAxiosError(err)) {
					const message = err.response?.data?.detail || 'Error en las credenciales';
					toast.error(message);
				} else {
					toast.error('Ocurrió un error inesperado al traer tus chats.');
				}
				setChats([]);
			} finally {
				setLoading(false);
			}
		};

		fetchChats();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated, refreshChats]);

	const navigate = useNavigate();

	const newChat = async () => {
		try {
			const chat = await chatService.newChat('Nuevo Chat');
			setLoadingCreate(true);
			setChats((chats) => [chat, ...chats]);
			setActiveChatId(chat.id);
			navigate(`/chat/${chat.id}`, { replace: true });
		} catch (err) {
			if (axios.isAxiosError(err)) {
				const message = err.response?.data?.detail || 'Error en las credenciales';
				toast.error(message);
			} else {
				toast.error('Ocurrió un error inesperado al crear el chat.');
			}
		} finally {
			setLoadingCreate(false);
		}
	};

	const handleDelete = async (id: number) => {
		const previousChats = [...chats];
		const isDeletingActive = id === activeChatId;
		// Optimistic update
		setChats((prev) => prev.filter((c) => c.id !== id));

		if (isDeletingActive) {
			navigate(`/chat`, { replace: true });
		}

		try {
			await chatService.deleteChat(id);
		} catch (err) {
			// Rollback
			setChats(previousChats);

			if (axios.isAxiosError(err)) {
				const message = err.response?.data?.detail || 'Error eliminando el chat';
				toast.error(message);
			} else {
				toast.error('Ocurrió un error inesperado al eliminar el chat');
			}
		}
	};

	const handleUpdate = async (id: number, newTitle: string) => {
		const previousChats = [...chats];

		// Optimistic update
		setChats((prev) => prev.map((c) => (c.id === id ? { ...c, titulo: newTitle } : c)));

		try {
			const updated = await chatService.updateChat(id, newTitle);

			// Si backend devuelve datos actualizados
			setChats((prev) => prev.map((c) => (c.id === id ? updated : c)));
		} catch (err) {
			// 3Rollback
			setChats(previousChats);

			if (axios.isAxiosError(err)) {
				const message = err.response?.data?.detail || 'Error actualizando el chat';
				toast.error(message);
			} else {
				toast.error('Ocurrió un error inesperado al actualizar el chat');
			}
		}
	};



	const { open, setOpen } = useAppContext();
	return (
		<>
			{open  && (
				<div
					className='sidebar-overlay'
					onClick={() => setOpen(false)}
				/>
			)}
			<div className={`sidebar-container ${open ? '' : 'closed'}`}>
				<div className='menuSuperior'>
					<button
						className='btn-default icon-div'
						onClick={() => {
							setOpen(!open);
						}}
					>
						<MenuIcon />
					</button>

					{isAuthenticated && (
						<div
							className='menuInferior'
							style={{ width: '100%' }}
						>
							<button
								className='btn-default'
								onClick={newChat}
								disabled={loadingCreate}
							>
								<PlusIcon />
								<p className='logout-text'>Nuevo Chat</p>
							</button>
						</div>
					)}
				</div>
				{isAuthenticated && (
					<div className='chats'>
						<p>Tus Chats</p>
						{loading && <p>Cargando...</p>}

						{!loading &&
							chats.map((chat) => (
								<SideBarItem
									key={chat.id}
									id={chat.id}
									txt={chat.titulo}
									active={chat.id === activeChatId}
									onClick={() => {
										setActiveChatId(chat.id);
										navigate(`/chat/${chat.id}`);
									}}
									onDelete={handleDelete}
									onUpdate={handleUpdate}
								/>
							))}
					</div>
				)}
				<div className='menuInferior'>
					<button
						className='btn-default'
						onClick={authService.logout}
					>
						<ExitIcon />
						<p className='logout-text'>Cerrar Sesión</p>
					</button>
				</div>
			</div>
		</>
	);
}
