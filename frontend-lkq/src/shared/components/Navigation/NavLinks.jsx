import React, { useContext} from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import './NavLinks.css';

const NavLinks = props => {
    const currentAuth = useContext(AuthContext);
    return (
        <ul className="nav-links">
            {true && <li onClick={props.onClick}><NavLink exact="true" to="/">ALL USERS</NavLink></li>}
            {currentAuth.isLoggedIn && <li onClick={props.onClick}><NavLink to={`${currentAuth.userId}/quotes`}>PLACES</NavLink></li>}
            {currentAuth.isLoggedIn && <li onClick={props.onClick}><NavLink to="/quotes/new">ADD</NavLink></li>}
            {!currentAuth.isLoggedIn && <li onClick={props.onClick}><NavLink to="/auth">AUTH</NavLink></li>}
            {currentAuth.isLoggedIn && <li> <button onClick={currentAuth.logout}>LOGOUT</button></li>}

        </ul>
    )
};

export default NavLinks;