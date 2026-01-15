import { createPortal } from 'react-dom';

interface PortalProps {
	children: React.ReactNode;
}

export default function Portal({ children }: PortalProps) {
	const portalRoot = document.getElementById('portal-root');

	if (!portalRoot) return null;

	return createPortal(children, portalRoot);
}
