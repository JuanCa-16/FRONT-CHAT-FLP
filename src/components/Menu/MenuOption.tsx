import './MenuOption.scss';

interface MenuOptionProps {
	title: string;
	desc: string;
}
const MenuOption = ({ title = 'Modelo', desc = 'Descripción' }: MenuOptionProps) => {
	return (
		<div className='menuOption-container'>
			<p className='title'>{title}</p>
			<p className='description'>{desc}</p>
		</div>
	);
};

export default MenuOption;
