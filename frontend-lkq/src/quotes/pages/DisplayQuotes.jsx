import React, { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/HttpClientHook';
import QuoteList from '../components/QuoteList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';


const DisplayQuotes = props => {

    const paramType = props.paramType;
    const paramId = useParams().paramId;
    const paramElements = (paramType ? ((paramType !== 'quote' ? '/'+paramType : '') + ('/'+paramId) ) : '')
    const [loadedQuotes, setLoadedQuotes] = useState(undefined);
    const {isLoading, clientError, sendRequest, clearClientError} = useHttpClient();

    useEffect(() => {
        const fetchQuotes = async () => {
            const url = `http://${window.location.hostname}:${process.env.PORT||5000}/api/quotes${paramElements||''}`
            try {
                const responseData = await sendRequest(url);
                setLoadedQuotes(paramType !== "quote" ? responseData.quotes : [responseData.quote]);
            } catch (error) { };
        };
        fetchQuotes();
    }, [sendRequest, paramType, paramElements]);

    const quoteDeletedHandler = deletedQuoteId => {
        setLoadedQuotes(prev => prev.filter(quote => quote.id !== deletedQuoteId))
    };

    return (
        <Fragment>
            <ErrorModal error={clientError} onClear={clearClientError} />
            {isLoading && <LoadingSpinner asOverlay />}

            {!isLoading && loadedQuotes && <QuoteList paramType={paramType} paramId={paramId} items={loadedQuotes} onDeleteQuote={quoteDeletedHandler} />}
        </Fragment>
    );
}

export default DisplayQuotes;
