import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { Header } from "./components/Header";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Header />
    </div>
  )
}

export default App
