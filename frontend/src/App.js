import './App.css';
import Home from './components/home'
import LoginPage from './components/login';
import RegisterPage from './components/register';
import {
  BrowserRouter as Router,
  Route, Routes
} from 'react-router-dom';

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="home" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
