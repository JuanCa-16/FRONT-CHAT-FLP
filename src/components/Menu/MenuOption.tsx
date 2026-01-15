import { ThemeIcon } from '../Icons';
import './MenuOption.scss';

interface MenuOptionProps {
	id: string;
	title: string;
	desc: string;
	currentModel: string;
	onClick: (id: string) => void;
	color?: boolean;
}
const MenuOption = ({ id, title = 'Modelo', desc = 'Descripción', currentModel, onClick, color }: MenuOptionProps) => {
	const isActive = id === currentModel;
	return (
		<div
			className={`menuOption-container ${isActive ? 'active' : ''}`}
			onClick={() => onClick(id)}
		>
			<p className='title'>{title}</p>

			{color ? (
				<div className='colorContainer'>
					<div style={{ display: 'flex', alignItems: 'center', color: id }}>
						<ThemeIcon />
					</div>
					<p className='description'>{desc}</p>
				</div>
			) : (
				<p className='description'>{desc}</p>
			)}
		</div>
	);
};

export default MenuOption;
