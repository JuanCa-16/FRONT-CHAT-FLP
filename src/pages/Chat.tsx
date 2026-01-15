import { useState } from 'react';
import Tag from '../components/Btns/Tag';
import InputChat from '../components/Inputs/InputChat';
import Message from '../components/Inputs/Message';
import './Chat.css';
import Menu from '../components/Menu/Menu';

const Chat = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	return (
		<div className='chat-container'>
			<div className='ellipse ellipse-1 ' />
			<div className='ellipse ellipse-2 ' />

			<div className='blur'>
				<Tag onOpenMenu={() => setMenuOpen(true)} />
				<Menu
					open={menuOpen}
					onClose={() => setMenuOpen(false)}
				/>
				<Message content='Hola Chat FLP como estas?'></Message>
				<Message
					content='Esta es la respuesta del RAG generada gracias a la IA del gemini y los embeddings'
					inverse='inverse'
				></Message>
				<InputChat />
			</div>
		</div>
	);
};

export default Chat;
