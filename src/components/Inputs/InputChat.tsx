import { SendIcon } from '../Icons';
import IconBtn from '../Btns/IconBtn';
import './InputChat.scss';
import { useRef } from 'react';

const InputChat = () => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const handleInput = () => {
		const el = textareaRef.current;
		if (!el) return;

		el.style.height = 'auto';
		el.style.height = `${el.scrollHeight}px`;
	};

	return (
		<div className='input-container'>
			<textarea
				ref={textareaRef}
				rows={1}
				onInput={handleInput}
			/>
			<div className='btn'>
				<IconBtn Icon={<SendIcon />} />
			</div>
		</div>
	);
};

export default InputChat;
