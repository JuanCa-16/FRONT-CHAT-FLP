import InputChat from '../components/Inputs/InputChat';
import Message from '../components/Inputs/Message';
import './Chat.css';

const Chat = () => {
	return (
		<div className='chat-container'>
			<div className='ellipse ellipse-1 ' />
			<div className='ellipse ellipse-2 ' />

			<div className='blur'>
				<Message content='Hola Chat FLP como estas?'></Message>
				<Message content='Esta es la respuesta del RAG generada gracias a la IA del gemini y los embeddings' inverse='inverse'></Message>
				<InputChat />
				
			</div>
		</div>
	);
};

export default Chat;
