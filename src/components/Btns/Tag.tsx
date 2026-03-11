import type { JSX } from 'react';
import type { TagOption } from '../../interfaces';
import { ChatIcon, GearIcon, GitIcon, PdfIcon, ThemeIcon, UserIcon, YoutubeIcon } from '../Icons';
import './Tag.scss';

interface InputChatProps {
	onOpenMenu: () => void;
	option?: TagOption;
	text?: string;
	Icon?: React.ReactElement;
}

const Tag = ({ onOpenMenu, option, text, Icon }: InputChatProps) => {
	if (option) {
		const { name, title } = option;
		let icon: JSX.Element;
		switch (title) {
			case 'Tema':
				icon = <ThemeIcon />;
				break;
			case 'Modelo':
				icon = <GearIcon />;
				break;
			case 'Git':
				icon = <GitIcon />;
				break;
			case 'Video':
				icon = <div style={{width:'100%', height:'100%', padding:'2px', display:'flex', justifyContent:'center', alignItems:'center'}}><YoutubeIcon /></div>;
				break;
			case 'Pdf':
				icon = <PdfIcon />;
				break;
			case 'Chat':
				icon = <ChatIcon />;
				break;
			case 'User':
				icon = <UserIcon />;
				break;
			default:
				icon = <GearIcon />;
		}
		return (
			<div
				className='tag-container'
				onClick={onOpenMenu}
			>
				{icon}

				<p>{name}</p>
			</div>
		);
	} else {
		return (
			<div
				className='tag-container'
				onClick={onOpenMenu}
				style={{ height: 'fit-content', width: '100%' }}
			>
				<div
					className='tag-icon'
					style={{
						height: '20px',
						width: '20px',
						maxWidth: '29px',
						maxHeight: '29px',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						flexShrink: 0,
					}}
				>
					{Icon}
				</div>
				<p>{text}</p>
			</div>
		);
	}
};

export default Tag;
