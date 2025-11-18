import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';
import Login from './components/Login/login';
import Dashboard from './components/Dashboard/dashboard';

function App() {
  return(
    <Router>
      
      <Routes>

        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>

      </Routes>

    </Router>
  );
}

export default App;
