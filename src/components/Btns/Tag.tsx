import type { TagOption } from '../../interfaces';
import { GearIcon, ThemeIcon } from '../Icons';
import './Tag.scss';

interface InputChatProps {
	onOpenMenu: () => void;
	option: TagOption;
}

const Tag = ({ onOpenMenu, option }: InputChatProps) => {
	const { name, title } = option;
	return (
		<div
			className='tag-container'
			onClick={onOpenMenu}
		>
			{title === 'Tema' ? <ThemeIcon /> : <GearIcon />}

			<p>{name}</p>
		</div>
	);
};

export default Tag;
