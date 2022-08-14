import React, { /* Suspense,  */Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthContext } from './shared/context/AuthContext';
import { useAuth } from './shared/hooks/AuthHook';

import Users from './users/pages/Users';
import Auth from './users/pages/Auth';
import NewQuote from'./quotes/pages/NewQuote';
import UpdateQuote from'./quotes/pages/UpdateQuote';
import SearchQuote from'./quotes/pages/SearchQuote';
import DisplayQuotes from'./quotes/pages/DisplayQuotes';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';




const App = () => {

    const { token, login, logout, userId, name, email, isAdmin } = useAuth();

    let routes;

    if (token) {
        routes = (
            <Fragment>
            
                <Route exact path="/" element={<Navigate replace to="/quotes" />} />
                <Route exact path="/users" element={<Users />} />
                <Route exact path="/quotes" element={<DisplayQuotes />} />
                <Route exact path="/quotes/quote/:paramId" element={<DisplayQuotes paramType="quote" />} />
                <Route exact path="/quotes/user/:paramId" element={<DisplayQuotes paramType="user" />} />
                <Route exact path="/quotes/author/:paramId" element={<DisplayQuotes paramType="author" />} />
                <Route exact path="/quotes/tag/:paramId" element={<DisplayQuotes paramType="tag" />} />
                <Route exact path="/quotes/search/:paramId" element={<DisplayQuotes paramType="search" />} />
                <Route exact path="/quotes/newsearch" element={<SearchQuote />} />
                <Route exact path="/quotes/new" element={<NewQuote />} />
                <Route exact path="/quotes/edit/:quoteId" element={<UpdateQuote />} />

                {/* REDIRECT ROUTE */}
                <Route
                    path="*"
                    element={<Navigate replace to="/" />}
                />

            </Fragment>
        )
    } else {
        routes = (
            <Fragment>
                <Route exact path="/" element={<Navigate replace to="/quotes" />} />
                <Route exact path="/users" element={<Users />} />
                <Route exact path="/quotes" element={<DisplayQuotes />} />
                <Route exact path="/quotes/quote/:paramId" element={<DisplayQuotes paramType="quote" />} />
                <Route exact path="/quotes/user/:paramId" element={<DisplayQuotes paramType="user" />} />
                <Route exact path="/quotes/author/:paramId" element={<DisplayQuotes paramType="author" />} />
                <Route exact path="/quotes/tag/:paramId" element={<DisplayQuotes paramType="tag" />} />
                <Route exact path="/quotes/search/:paramId" element={<DisplayQuotes paramType="search" />} />
                <Route exact path="/quotes/newsearch" element={<SearchQuote />} />
                <Route exact path="/auth" element={<Auth />} />

                {/* REDIRECT ROUTE */}
                <Route
                    path="*"
                    element={
                        <Navigate replace to="/auth" />
                    }
                />
            </Fragment>
        )
    };

    return (
        <AuthContext.Provider value={{
            isLoggedIn: !!token,
            isAdmin: isAdmin,
            userId: userId,
            name: name,
            email: email,
            token: token,
            login: login,
            logout: logout,
        }}>
            <Router>
                <MainNavigation />
                <main>
                    {/* <Suspense fallback={
                        <div className="center">
                            <LoadingSpinner />
                        </div>
                    }> */}
                        <Routes>
                            {routes}
                        </Routes>
                    {/* </Suspense> */}
                </main>
                {/* <Footer /> */}
            </Router>
        </AuthContext.Provider>
    );
}
export default App;
