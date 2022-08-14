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
            <h3 className='center'>{props.header}</h3>
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
