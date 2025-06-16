import { useState } from 'react'
import Login from './screens/Login'
import './App.css'
import Register from './screens/Register'
import {BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)

    return(
        <BrowserRouter>
            <Routes>
                <Route index path="/" element={<Login/>}/>
                <Route path="/register" element={<Register/>} />
            </Routes>
        </BrowserRouter>
    )

}

export default App
