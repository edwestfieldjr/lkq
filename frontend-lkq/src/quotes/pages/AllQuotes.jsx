import React, { useState, useEffect, Fragment } from 'react';
import { useHttpClient } from '../../shared/hooks/HttpClientHook';
import QuoteList from '../components/QuoteList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';


const AllQuotes = () => {

    const [loadedQuotes, setLoadedQuotes] = useState(undefined);

    const {isLoading, clientError, sendRequest, clearClientError} = useHttpClient();


    useEffect(() => {
        const fetchQuotes = async () => {
            const url = `http://${window.location.hostname}:5000/api/quotes`
            try {
                const responseData = await sendRequest(url);

                setLoadedQuotes(responseData.quotes);
            } catch (error) {};
        };
        fetchQuotes();
    }, [sendRequest]);

    const quoteDeletedHandler = deletedQuoteId => {
        setLoadedQuotes(prev => prev.filter(quote => quote.id !== deletedQuoteId))
    };

    return (
        <Fragment>
            {/* <ErrorModal error={clientError} onClear={clearClientError} /> */}
            {/* {isLoading && <LoadingSpinner asOverlay />} */}

            {!isLoading && loadedQuotes && <QuoteList items={loadedQuotes} onDeleteQuote={quoteDeletedHandler} />}
        </Fragment>

    );
}

export default AllQuotes;
