import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Chat from './pages/Chat';
import Pdfs from './pages/Pdfs';
import Videos from './pages/Videos';
import Login from './pages/Login';
import MainLayout from './layouts/MainLayout';
import { useAppContext } from './context/useAppContext';
import Git from './pages/Git';

function ProtectedRoute() {
	const { isAuthenticated } = useAppContext();

	if (!isAuthenticated) {
		return (
			<Navigate
				to='/login'
				replace
			/>
		);
	}

	return <Outlet />;
}

function PublicRoute() {
	const { isAuthenticated } = useAppContext();

	if (isAuthenticated) {
		return (
			<Navigate
				to='/chat'
				replace
			/>
		);
	}

	return <Outlet />;
}

function RootRedirect() {
	const { isAuthenticated } = useAppContext();

	return (
		<Navigate
			to={isAuthenticated ? '/chat' : '/login'}
			replace
		/>
	);
}
function App() {
	return (
		<Routes>
			<Route
				path='/'
				element={<RootRedirect />}
			/>

			<Route element={<PublicRoute />}>
				<Route
					path='/login'
					element={<Login />}
				/>
			</Route>

			<Route element={<ProtectedRoute />}>
				<Route element={<MainLayout />}>
					<Route
						path='/chat/:id?'
						element={<Chat />}
					/>
					<Route
						path='/pdfs'
						element={<Pdfs />}
					/>
					<Route
						path='/videos'
						element={<Videos />}
					/>
					<Route
						path='/git'
						element={<Git />}
					/>
				</Route>
			</Route>

			<Route
				path='*'
				element={
					<Navigate
						to='/'
						replace
					/>
				}
			/>
		</Routes>
	);
}

export default App;
