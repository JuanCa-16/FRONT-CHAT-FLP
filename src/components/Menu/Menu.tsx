import Portal from '../Portal';
import MenuOption from './MenuOption';
import './Menu.scss';
import type { TagOption } from '../../interfaces';
interface MenuProps {
	open: boolean;
	onClose: () => void;
	currentModel: string;
	onModelChange: (model: string) => void;
	option: TagOption[];
}

const Menu = ({ open, onClose, currentModel, onModelChange, option }: MenuProps) => {
	const handleModelSelect = (modelId: string) => {
		onModelChange(modelId);
		onClose();
	};

	return (
		<Portal>
			{open && (
				<div
					className='backdrop'
					onClick={onClose}
				/>
			)}
			<div className={`menu-container ${open ? 'open' : ''}`}>
				{option.map((model) => (
					<MenuOption
						onClick={() => handleModelSelect(model.id)}
						currentModel={currentModel}
						key={model.id}
						id={model.id}
						title={model.name}
						desc={model.desc}
						color={model.title === 'Tema' ? true : false}
					/>
				))}
			</div>
		</Portal>
	);
};

export default Menu;
