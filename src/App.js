import './App.css';
import Editor from './components/Editor';
import LoginPage from './pages/LoginPage.jsx';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import SignupPage from './pages/SignupPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate replace to={`/docs/login`}/>}></Route>
        <Route path='/docs/:id' element={<Editor/>}></Route>
        <Route path='/docs/login' element={<LoginPage/>}></Route>
        <Route path='/docs/signup' element={<SignupPage/>}></Route>
      </Routes>
    </Router>

  );
}

export default App;
