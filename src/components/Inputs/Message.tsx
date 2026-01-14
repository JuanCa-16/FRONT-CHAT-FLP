import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { cb } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './Message.scss';

interface MessageProps {
	content?: string;
	inverse?: string;
}
interface CodeComponentProps {
	node?: unknown;
	inline?: boolean;
	className?: string;
	children?: React.ReactNode;
}

export default function Message({ content, inverse }: MessageProps) {
	return (
		<div className={`message-container ${inverse}`}>
			<div className='message'>
				<ReactMarkdown
					components={{
						code({ inline, className, children, ...props }: CodeComponentProps) {
							const match = /language-(\w+)/.exec(className || '');
							return !inline && match ? (
								<SyntaxHighlighter
									style={cb}
									language={match[1]}
									PreTag='div'
									showLineNumbers
									wrapLongLines={true}
									lineProps={{
										style: { wordBreak: 'break-word' },
									}}
									className='code-block'
									{...props}
								>
									{String(children).replace(/\n$/, '')}
								</SyntaxHighlighter>
							) : (
								<code {...props}>{children}</code>
							);
						},
					}}
				>
					{content}
				</ReactMarkdown>
			</div>
		</div>
	);
}
