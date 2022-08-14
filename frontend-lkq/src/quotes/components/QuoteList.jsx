import React, { useState, useContext, useEffect, Fragment} from 'react';
import Card from '../../shared/components/UIElements/Card';
import { useHttpClient } from '../../shared/hooks/HttpClientHook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

import "./QuoteList.css"
import QuoteItem from './QuoteItem';
import Button from '../../shared/components/FormElements/Button';
import { AuthContext } from '../../shared/context/AuthContext';


const QuoteList = props => {

    const currentAuth = useContext(AuthContext);

    const paramType = (props.paramType || '').toLowerCase();
    const paramId = props.paramId || '';
    const [titleParam, setTitleParam] = useState('');
    const {isLoading, clientError, sendRequest, clearClientError} = useHttpClient();


    useEffect(() => {
        if (["author","tag","user"].includes(paramType)) {
        const fetchParam = async () => {
            const url = `${process.env.REACT_APP_BACKEND_API_ADDRESS}/api/quotes/getparam/${paramType}/${paramId}`
            try {
                const responseData = await sendRequest(url);
                setTitleParam(responseData.result);
            } catch (error) { };
        };
        fetchParam();
        } else {
            setTitleParam(paramId)
        }
    }, [sendRequest, paramType, paramId]);

    if (props.items.length <= 0) {
        return (
            <div className='quote-list center'> 
                <Card>
                    <h2>No quotes found, create?</h2>
                    <Button to="/quotes/new">Create</Button>
                </Card>
            </div>
        );
    } else {
        return (<Fragment>
            <ErrorModal error={clientError + " QuoteListJSX"} onClear={clearClientError} />
            {isLoading && <LoadingSpinner asOverlay />}

            {(props.paramId && paramType !== "quote") ? <h2 className='center'>Quotes {paramType === "user" && "posted by"} {["tag", "search"].includes(paramType) && "with the"} {paramType !== "author" ? paramType + 
            `${paramType ==='search' ? ' term' :''}`
            + ":" : "by"} {["tag", "search"].includes(paramType) && "“"}{titleParam}{["tag", "search"].includes(paramType) && "”"}</h2> : <h2 className='center'>{paramType !== "quote" ? "All Quotes" : ''} &nbsp;</h2>}
            <ul className="quote-list">
                {props.items.map(quote => ( 
                        (currentAuth.isAdmin || currentAuth.userId === quote.creator.id || quote.isPublic) && <QuoteItem 
                            key={quote._id.toString()} 
                            id={quote.id} 
                            text={quote.text} 
                            authorId={quote.author.id}
                            author_name={quote.author.name}
                            author_ref_url={quote.author.ref_url}
                            author_ref_img={quote.author.ref_img}
                            author_id={quote.author.id}
                            tags={quote.tags}
                            isPublic={quote.isPublic} 
                            creatorId={quote.creator.id} 
                            creatorName={quote.creator.name} 
                            onDelete={props.onDeleteQuote}
                        />
                    )
                )}
            </ul>
            </Fragment>);
    }
}

export default QuoteList;
