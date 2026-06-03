import './App.css'
import { KanbanProvider } from './context/KanbanProvider'
import Layout from './pages/Layout'

function App() {

  return (
    <KanbanProvider>
      <Layout />
    </KanbanProvider>
  )
}

export default App
