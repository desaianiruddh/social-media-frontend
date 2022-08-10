import React, { useState } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { logout } from '../redux/userSlice';

function MenuBar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userData.user);
  const pathname = window.location.pathname;
  const path = pathname === '/' ? 'home' : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);
  const handleItemClick = (e, { name }) => {
    if (user) {
      setActiveItem('home');
      return;
    }
    setActiveItem(name);
  };
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    setActiveItem('home');
  };
  const menuBar = (
    <Menu pointing secondary size="massive" color="blue">
      <Menu.Item
        name="home"
        active={activeItem === 'home'}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />
      {!user ? (
        <Menu.Menu position="right">
          <Menu.Item
            name="login"
            active={activeItem === 'login'}
            onClick={handleItemClick}
            as={Link}
            to="/login"
          />
          <Menu.Item
            name="register"
            active={activeItem === 'register'}
            onClick={handleItemClick}
            as={Link}
            to="/register"
          />
        </Menu.Menu>
      ) : (
        <Menu.Menu position="right">
          <Menu.Item name="logout" onClick={handleLogout} as={Link} to="/" />
        </Menu.Menu>
      )}
    </Menu>
  );
  return menuBar;
}

export default MenuBar;
