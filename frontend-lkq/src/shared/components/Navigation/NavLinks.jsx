import React, { useContext} from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import './NavLinks.css';

const NavLinks = props => {
    const currentAuth = useContext(AuthContext);
    return (
        <ul className="nav-links">
            <li>{!currentAuth.isLoggedIn ? <span>Not l</span> : <span>L</span>}ogged in {currentAuth.isLoggedIn && <span>as {currentAuth.name}</span>}</li>
            {true && <li onClick={props.onClick}><NavLink exact="true" to="/">ALL USERS</NavLink></li>}
            {currentAuth.isLoggedIn && <li onClick={props.onClick}><NavLink to={`${currentAuth.userId}/quotes`}>QUOTES</NavLink></li>}
            {currentAuth.isLoggedIn && <li onClick={props.onClick}><NavLink to="/quotes/new">ADD</NavLink></li>}
            {!currentAuth.isLoggedIn && <li onClick={props.onClick}><NavLink to="/auth">LOGIN/SIGN-UP</NavLink></li>}
            {currentAuth.isLoggedIn && <li> <button onClick={currentAuth.logout}>LOGOUT</button></li>}

        </ul>
    )
};

export default NavLinks;