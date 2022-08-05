import React, { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/HttpClientHook';
import QuoteList from '../components/QuoteList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';


const UserQuotes = () => {

    const [loadedQuotes, setLoadedQuotes] = useState(undefined);

    const {isLoading, clientError, sendRequest, clearClientError} = useHttpClient();

    const userId = useParams().userId || null;

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const responseData = await sendRequest(`http://${window.location.hostname}:5000/api/quotes/user/${userId}`);

                setLoadedQuotes(responseData.quotes);
            } catch (error) {};
        };
        fetchQuotes();
    }, [sendRequest, userId]);

    const quoteDeletedHandler = deletedQuoteId => {
        setLoadedQuotes(prev => prev.filter(quote => quote.id !== deletedQuoteId))
    };

    return (
        <Fragment>
            <ErrorModal error={clientError} onClear={clearClientError} />
            {isLoading && <LoadingSpinner asOverlay />}
            {!isLoading && loadedQuotes && <QuoteList items={loadedQuotes} onDeleteQuote={quoteDeletedHandler} />}
        </Fragment>
    );
}

export default UserQuotes;
