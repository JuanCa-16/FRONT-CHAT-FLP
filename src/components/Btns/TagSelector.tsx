import { useState } from 'react';
import Tag from '../Btns/Tag';
import Menu from '../Menu/Menu';
import type { TagOption } from '../../interfaces';

interface TagSelectorProps {
	value: string;
	options: TagOption[];
	onChange: (model: string) => void;
}

const TagSelector = ({ value, options, onChange }: TagSelectorProps) => {
	const [open, setOpen] = useState(false);

	const currentOption = options.find((o) => o.id === value);

	if (!currentOption) return null;

	return (
		<>
			<Tag
				onOpenMenu={() => setOpen(true)}
				option={currentOption}
			/>

			<Menu
				open={open}
				onClose={() => setOpen(false)}
				currentModel={value}
				onModelChange={onChange}
				option={options}
			/>
		</>
	);
};

export default TagSelector;
