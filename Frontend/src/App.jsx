import { useState } from 'react'
import Login from './screens/Login'
import './App.css'
import Register from './screens/Register'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import ProfessionalsList from './screens/ProfessionalsList';

function App() {
  const [count, setCount] = useState(0)

    return(
        <BrowserRouter>
            <Routes>
                <Route index path="/" element={<Login/>}/>
                <Route path="/register" element={<Register/>} />
                <Route path="/professionalsList" element={<ProfessionalsList/>} />

            </Routes>
        </BrowserRouter>
    )

}

export default App
