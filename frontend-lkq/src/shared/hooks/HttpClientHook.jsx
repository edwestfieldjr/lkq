import { useState, useRef, useCallback, useEffect } from 'react';

export const useHttpClient = (/* initialInputs, initialFormValidity */) => {

    const [isLoading, setIsLoading] = useState(false);
    const [clientError, setClientError] = useState(undefined);
    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(
        async (url, method = 'GET', body = null, headers = {}) => {

            setIsLoading(true)
            const httpAbortController = new AbortController();
            activeHttpRequests.current.push(httpAbortController);

            try {
                /**/
                // [body, url, method, headers, httpAbortController.signal].forEach(e => {console.log(e)});
                /**/
                const response = await fetch(url, {
                    method,
                    body,
                    headers,
                    signal: httpAbortController.signal
                });
                
                const responseData = await response.json();
                
                activeHttpRequests.current = activeHttpRequests.current.filter(
                    reqCtrl => reqCtrl !== httpAbortController
                );
                if (!response.ok) {
                    throw new Error(responseData.message);
                } else {
                    setIsLoading(false);
                    return responseData;
                };
            } catch (error) {
                setClientError(error.message);
                setIsLoading(false)
                throw error;
            }
        
        }, []
    );

    const clearClientError = () => setClientError(null);

    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(
                abortController => abortController.abort()
            );
        };
    }, []); 

    return { isLoading, clientError, sendRequest, clearClientError };

};