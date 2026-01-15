import { GearIcon } from '../Icons';
import './Tag.scss';

interface InputChatProps {
	onOpenMenu: () => void;
}
const Tag = ({ onOpenMenu }: InputChatProps) => {
	return (
		<div
			className='tag-container'
			onClick={onOpenMenu}
		>
			<GearIcon />
			<p>Modelo</p>
		</div>
	);
};

export default Tag;
