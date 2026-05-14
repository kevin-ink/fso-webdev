import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'
import { UserContextProvider } from './UserContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserContextProvider>
    <Router>
      <App />
    </Router>
  </UserContextProvider>
)
