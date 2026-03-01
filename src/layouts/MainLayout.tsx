import { Outlet } from 'react-router-dom';
import './MainLayout.scss';
import SideBar from '../components/SideBar/SideBar';

export default function MainLayout() {
	return (
		<div className='main-layout'>
			<SideBar />
			<Outlet />
		</div>
	);
}
