import { useEffect, useState } from 'react';
import './SideBarItem.scss';

interface SideBarItemProps {
	id: number;
	txt: string;
	active?: boolean;
	onClick?: () => void;
	onDelete?: (id: number) => void;
	onUpdate?: (id: number, newTitle: string) => void;
}

export default function SideBarItem({
	id,
	txt = 'Titulo Chat',
	active = false,
	onClick,
	onDelete,
	onUpdate,
}: SideBarItemProps) {
	const [editing, setEditing] = useState(false);
	const [value, setValue] = useState(txt);

	const handleDoubleClick = () => {
		setEditing(true);
	};

	const handleBlur = () => {
		setEditing(false);
		if (value.trim() && value !== txt) {
			onUpdate?.(id, value.trim());
		} else {
			setValue(txt);
		}
	};

	useEffect(() => {
		setValue(txt);
	}, [txt]);
	return (
		<div
			className={`sidebarItem ${active ? 'active' : ''}`}
			onClick={onClick}
		>
			{editing ? (
				<input
					autoFocus
					value={value}
					onChange={(e) => setValue(e.target.value)}
					onBlur={handleBlur}
					onKeyDown={(e) => {
						if (e.key === 'Enter') handleBlur();
					}}
					className='sidebarItem-input'
				/>
			) : (
				<span
					className='sidebarItem-text'
					onDoubleClick={handleDoubleClick}
				>
					{txt}
				</span>
			)}

			<button
				className='delete-btn'
				onClick={(e) => {
					e.stopPropagation();
					onDelete?.(id);
				}}
			>
				×
			</button>
		</div>
	);
}
