import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [tokenExpirationDateState, setTokenExpirationDateState] = useState();
    const [userId, setUserId] = useState(null);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);

    const login = useCallback((username, emailAddr, uid, token, expirationDate) => {
        setToken(token);
        setUserId(uid);
        setName(username);
        setEmail(emailAddr);
        const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 4);
        setTokenExpirationDateState(tokenExpirationDate)
        localStorage.setItem(
            'userData',
            JSON.stringify(
                {
                    name: username,
                    email: emailAddr,
                    userID: uid,
                    token: token,
                    expiration: tokenExpirationDate.toISOString()
                }
            )
        )
    }, [],);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setName(null);
        setEmail(null);
        setTokenExpirationDateState(null);
        localStorage.removeItem('userData');
    }, [],)

    useEffect(() => {
        console.log("first useEffect called");
        if (token && tokenExpirationDateState) {
            const remainingTime = tokenExpirationDateState.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else { clearTimeout(logoutTimer); }
    }, [token, logout, tokenExpirationDateState]);

    useEffect(() => {
        console.log("secind useEffect called");

        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
            login(storedData.name, storedData.email, storedData.userID, storedData.token, new Date(storedData.expiration));
        }
    }, [login]);
    return { token, login, logout, userId, name, email };

}