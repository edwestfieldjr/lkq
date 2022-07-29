import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [tokenExpirationDateState, setTokenExpirationDateState] = useState();
    const [userId, setUserId] = useState(null);

    const login = useCallback((uid, token, expirationDate) => {
        setToken(token);
        setUserId(uid);
        const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 4);
        setTokenExpirationDateState(tokenExpirationDate)
        localStorage.setItem(
            'userData',
            JSON.stringify(
                {
                    userID: uid,
                    token: token,
                    expiration: tokenExpirationDate.toISOString()
                }
            )
        )
    }, [],);

    const logout = useCallback(() => {
        setToken(null);
        setTokenExpirationDateState(null);
        setUserId(null);
        localStorage.removeItem('userData');
    }, [],)

    useEffect(() => {
        if (token && tokenExpirationDateState) {
            const remainingTime = tokenExpirationDateState.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else { clearTimeout(logoutTimer); }
    }, [token, logout, tokenExpirationDateState]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
            login(storedData.userID, storedData.token, new Date(storedData.expiration));
        }
    }, [login]);
    console.log("userData::: "+ localStorage.getItem('userData'));
    console.log("token::: "+ localStorage.token );
    return { token, login, logout, userId };

}