import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import Chat from './pages/Chat';
import Pdfs from './pages/Pdfs';
import Videos from './pages/Videos';
import Login from './pages/Login';
import MainLayout from './layouts/MainLayout';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<MainLayout />}>
					<Route
						path='/'
						element={<Chat />}
					/>
					<Route
						path='/chat/:id?'
						element={<Chat key={useParams().id} />}
					/>
					<Route
						path='/pdfs'
						element={<Pdfs />}
					/>

					<Route
						path='/videos'
						element={<Videos />}
					/>
				</Route>

				<Route
					path='/login'
					element={<Login />}
				/>

				<Route
					path='*'
					element={<h1>SIN RUTAS</h1>}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
