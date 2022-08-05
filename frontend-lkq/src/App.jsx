import React, { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Users from './users/pages/Users';
import Auth from './users/pages/Auth';
import NewQuote from './quotes/pages/NewQuote';
import UpdateQuote from './quotes/pages/UpdateQuote';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserQuotes from './quotes/pages/UserQuotes';
import AllQuotes from './quotes/pages/AllQuotes';
import { AuthContext } from './shared/context/AuthContext';
import { useAuth } from './shared/hooks/AuthHook';




const App = () => {

    const { token, login, logout, userId, name, email, isAdmin } = useAuth();

    let routes;

    if (token) {
        routes = (
            <Fragment>
            
                <Route exact path="/" element={<Navigate replace to="/users" />} />
                <Route exact path="/users" element={<Users />} />
                <Route exact path="/quotes" element={<AllQuotes />} />
                <Route exact path="/quotes/:quoteId" element={<AllQuotes />} />
                <Route exact path="/quotes/user/:userId" element={<AllQuotes />} />
                <Route exact path="/quotes/author/:authorId" element={<AllQuotes />} />
                <Route exact path="/quotes/tag/:tagId" element={<AllQuotes />} />
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
                <Route exact path="/" element={<Navigate replace to="/users" />} />
                <Route exact path="/users" element={<Users />} />
                <Route exact path="/quotes" element={<AllQuotes />} />
                <Route exact path="/quotes/:quoteId" element={<AllQuotes />} />
                <Route exact path="/quotes/user/:userId" element={<AllQuotes />} />
                <Route exact path="/quotes/author/:authorId" element={<AllQuotes />} />
                <Route exact path="/quotes/tag/:tagId" element={<AllQuotes />} />
                {/* <Route exact path="/:userId/quotes" element={<UserQuotes />} /> */}
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
                    <Routes>
                        {routes}
                    </Routes>
                </main>
                {/* <Footer /> */}
            </Router>
        </AuthContext.Provider>
    );
}
export default App;
