import Portal from '../Portal';
import MenuOption from './MenuOption';
import './Menu.scss';
interface MenuProps {
	open: boolean;
	onClose: () => void;
}

const models = [
	{ id: 'todo', name: 'General', desc: 'Modelo con todo' },
	{ id: 'pdf', name: 'Pdfs', desc: 'Modelo con todo' },
	{ id: 'video', name: 'Video', desc: 'Modelo con todo' },
	{ id: 'codigo', name: 'Codigo', desc: 'Modelo con todo' },
];

const Menu = ({ open, onClose }: MenuProps) => {
	return (
		<Portal>
			{open && (
				<div
					className='backdrop'
					onClick={onClose}
				/>
			)}
			<div className={`menu-container ${open ? 'open' : ''}`}>
				{models.map((model) => (
					<MenuOption
						key={model.id}
						title={model.name}
						desc={model.desc}
					/>
				))}
			</div>
		</Portal>
	);
};

export default Menu;
