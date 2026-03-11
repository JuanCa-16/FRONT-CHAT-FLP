import { SendIcon } from '../Icons';
import IconBtn from '../Btns/IconBtn';
import './InputChat.scss';
import { useRef, useState, type FormEvent } from 'react';

interface ChatInputProps {
	onSendMessage: (message: string) => void;
	placeholder?: string;
	isThinking:boolean;
}

const InputChat = ({ onSendMessage, placeholder = 'Escribe tu mensaje...', isThinking }: ChatInputProps) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const handleInput = () => {
		const el = textareaRef.current;
		if (!el) return;

		el.style.height = 'auto';
		el.style.height = `${el.scrollHeight}px`;
	};

	const [message, setMessage] = useState('');

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		if (!message.trim()) return;

		onSendMessage(message.trim());
		setMessage('');

		const el = textareaRef.current;
		if (el) {
			el.style.height = 'auto';
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		// Si presiona Enter SIN Shift
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault(); // Previene el salto de línea
			handleSubmit(e as FormEvent); // Envía el mensaje
		}
		// Si presiona Enter CON Shift, permite el salto de línea (comportamiento por defecto)
	};

	return (
		<form
			className='input-container'
			onSubmit={handleSubmit}
		>
			<textarea
				ref={textareaRef}
				rows={1}
				onInput={handleInput}
				onKeyDown={handleKeyDown}
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				placeholder={placeholder}
			/>
			<button
				className='btn'
				type='submit'
				disabled={!message.trim() || isThinking}
			>
				<IconBtn Icon={<SendIcon />} />
			</button>
		</form>
	);
};

export default InputChat;
