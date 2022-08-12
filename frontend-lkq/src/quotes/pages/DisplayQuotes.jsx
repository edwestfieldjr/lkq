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
        console.log(process.env.REACT_APP_BACKEND_API_ADDRESS)
        const fetchQuotes = async () => {
            const url = `${process.env.REACT_APP_BACKEND_API_ADDRESS}/api/quotes${paramElements||''}`
            console.log(url);
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
