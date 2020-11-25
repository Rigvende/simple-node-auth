import React, {useContext} from 'react';
import {NavLink, useHistory} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';

export const Navbar = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);

    const logoutHandler = event => {
        event.preventDefault();
        auth.logout();
        history.push('/');
    };

    return (
        <nav>
            <div className="nav-wrapper blue darken-1">
                <a href="/" className="brand-logo">Simple-Node-Auth</a>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><NavLink to='/users'>Users</NavLink></li>
                    <li><NavLink to='/register'>Add user</NavLink></li>                    
                    <li><a href="/logout" onClick={logoutHandler}>Logout</a></li>
                </ul>
            </div>
        </nav>
    )
};
