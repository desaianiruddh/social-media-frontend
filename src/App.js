import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MenuBar from './components/MenuBar';
import SinglePost from './pages/SinglePost';

const App = () => {
  const user = useSelector((state) => state.userData.user);
  return (
    <BrowserRouter>
      <div className='ui container'>
        <MenuBar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={user ? <Navigate replace to="/" />:<Login />} />
          <Route exact path="/register" element={user ? <Navigate replace to="/" />:<Register />} />
          <Route exact path="/posts/:postId" element={<SinglePost />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
