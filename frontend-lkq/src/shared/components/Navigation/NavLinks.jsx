import React, { useContext} from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import './NavLinks.css';

const NavLinks = props => {
    const currentAuth = useContext(AuthContext);
    return (
        <ul className="nav-links">
            <li>
                {!currentAuth.isLoggedIn ? <span>Not l</span> : <span>L</span>}ogged in {currentAuth.isLoggedIn && <span>as <strong>{currentAuth.name}</strong> ({!currentAuth.isAdmin ? 'Non-a' : 'A'}dmin)</span> } 

            </li>
            {currentAuth.isAdmin && <li onClick={props.onClick}><NavLink exact="true" to="/users">ALL USERS</NavLink></li>}
            {currentAuth.isLoggedIn && <li onClick={props.onClick}><NavLink to={`/quotes/user/${currentAuth.userId}`}>MY QUOTES</NavLink></li>}
            {/* {currentAuth.isLoggedIn &&  */}<li onClick={props.onClick}><NavLink to={`/quotes`}>ALL QUOTES</NavLink></li>{/* } */}
            {currentAuth.isLoggedIn && <li onClick={props.onClick}><NavLink to="/quotes/new">ADD A QUOTE</NavLink></li>}
            {!currentAuth.isLoggedIn && <li onClick={props.onClick}><NavLink to="/auth">LOGIN/SIGN-UP</NavLink></li>}
            {currentAuth.isLoggedIn && <li> <button onClick={currentAuth.logout}>LOGOUT</button></li>}

        </ul>
    )
};

export default NavLinks;