import './TopBar.scss';
import TagSelector from '../Btns/TagSelector';
import { COLORS, MODELS, PAGES } from '../../constants';
import { useAppContext } from '../../context/useAppContext';
import { useNavigate } from 'react-router-dom';
import Tag from '../Btns/Tag';
import { MenuIcon } from '../Icons';

interface TopBarProps {
	model: boolean;
	color: boolean;
	page: boolean;
}
export default function TopBar({ model, color, page }: TopBarProps) {
	const navigate = useNavigate();

	const {
		currentModel,
		setCurrentModel,
		currentColor,
		setCurrentColor,
		currentPage,
		setCurrentPage,
		activeChatId,
		setOpen,
	} = useAppContext();

	const handlePage = (pageId: string) => {
		if (pageId === '/chat') {
			setCurrentPage('/chat');
			navigate(activeChatId ? `/chat/${activeChatId}` : '/chat');
		} else {
			setCurrentPage(pageId);
			navigate(pageId);
		}
	};


	return (
		<div className='tags'>
			
				<div
					className='menu'
					style={{ height: '29px' }}
				>
					<Tag
						onOpenMenu={() => setOpen(true)}
						text={''}
						Icon={<MenuIcon />}
					/>
				</div>
		

			{model && (
				<TagSelector
					value={currentModel}
					options={MODELS}
					onChange={setCurrentModel}
				/>
			)}

			{color && (
				<TagSelector
					value={currentColor}
					options={COLORS}
					onChange={setCurrentColor}
				/>
			)}

			{page && (
				<TagSelector
					value={currentPage}
					options={PAGES}
					onChange={handlePage}
				/>
			)}
		</div>
	);
}
