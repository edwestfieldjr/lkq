import React, { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/HttpClientHook';
import QuoteList from '../components/QuoteList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';


const AllQuotes = () => {

    const allParamElements = {
        quote: useParams().quoteId || null,
        user: useParams().userId || null,
        author: useParams().authorId || null,
        tag: useParams().tagId || null
    }

    let paramElements, paramType;
    try {
        paramElements = Object.entries(allParamElements).filter(e => !e.includes(null))[0]
        paramType = paramElements[0]
        paramElements = paramElements.filter(f=>f != 'quote').join('/');
        paramElements = '/' + paramElements;
    } catch (error) {
        paramElements = ''
        paramType = null

    } finally {
        console.log(paramElements, paramType)
    }
    // paramElements = Object.entries(allParamElements).filter(e => !e.includes(null))[0].filter(f=>f != 'quote').join('/') || '';
    // // .reduce((p,c,i,r) => {

    // // }, '') || ''
    console.log(paramElements)

    const [loadedQuotes, setLoadedQuotes] = useState(undefined);

    const {isLoading, clientError, sendRequest, clearClientError} = useHttpClient();

 
    

    useEffect(() => {
        const fetchQuotes = async () => {
            const url = `http://${window.location.hostname}:${process.env.PORT||5000}/api/quotes${paramElements||''}`
            console.log(url)
            try {
                const responseData = await sendRequest(url);
                console.log(typeof(responseData))
                setLoadedQuotes(paramType !== "quote" ? responseData.quotes : [responseData.quote]);
            } catch (error) {};
        };
        fetchQuotes();
    }, [sendRequest]);

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

export default AllQuotes;
