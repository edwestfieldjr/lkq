import React, { useState, Fragment } from "react";

import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";
import "./MainNavigation.css"

const MainNavigation = props => {

    const [drawerIsOpen, setDrawerIsOpen] = useState(false);

    const toggleDrawer = (event, status=0) => {
        setDrawerIsOpen(!drawerIsOpen);
    }

    return (
        <Fragment>

                { drawerIsOpen && (
                    <Backdrop onClick={toggleDrawer} /> 
                )}
                <SideDrawer show={drawerIsOpen ? true : false}> 
                    <nav className="main-navigation__drawer-nav">
                        <NavLinks onClick={toggleDrawer}/>
                    </nav>
                </SideDrawer>
                <MainHeader>
                    <h2 className="main-navigation__title">
                        LKQ: Your Favorite Quotes
                    </h2>
                    <nav className="main-navigation__header-nav">
                        <NavLinks/>
                    </nav>
                    <button className="main-navigation__menu-btn" onClick={toggleDrawer}>
                        <span />
                        <span />
                        <span />
                    </button>
                </MainHeader>

        </Fragment>
    )
}

export default MainNavigation;