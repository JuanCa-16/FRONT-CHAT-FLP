import { SendIcon } from '../Icons';
import IconBtn from '../Btns/IconBtn';
import './InputChat.scss';
import { useRef, useState, type FormEvent } from 'react';

interface ChatInputProps {
	onSendMessage: (message: string) => void;
	placeholder?: string;
}

const InputChat = ({ onSendMessage, placeholder = 'Escribe tu mensaje...' }: ChatInputProps) => {
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

	return (
		<form
			className='input-container'
			onSubmit={handleSubmit}
		>
			<textarea
				ref={textareaRef}
				rows={1}
				onInput={handleInput}
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				placeholder={placeholder}
			/>
			<button
				className='btn'
				type='submit'
				disabled={!message.trim()}
			>
				<IconBtn Icon={<SendIcon />} />
			</button>
		</form>
	);
};

export default InputChat;
