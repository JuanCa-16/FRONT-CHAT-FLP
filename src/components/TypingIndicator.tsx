import './Inputs/Message.scss'
const TypingIndicator = () => {
  return (
		<div className='message-container inverse typing'>
			<div className='message typing-message'>
				<div className='typing-dots'>
					<span />
					<span />
					<span />
				</div>
			</div>
		</div>
  );
}

export default TypingIndicator
