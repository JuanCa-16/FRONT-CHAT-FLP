import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Chat from './pages/Chat';
import Pdfs from './pages/Pdfs';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path='/'
					element={<Chat />}
				/>
				<Route
					path='/pdfs'
					element={<Pdfs />}
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
