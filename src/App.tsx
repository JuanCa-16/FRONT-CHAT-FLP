import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Chat from './pages/Chat'

function App() {

  return (
   <BrowserRouter>
        <Routes>
          <Route path="/"  element={<Chat/>}/>

          <Route path="*" element={< h1>SIN RUTAS</h1>} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
