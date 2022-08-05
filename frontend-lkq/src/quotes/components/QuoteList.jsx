import React, { Fragment } from 'react';
import Card from '../../shared/components/UIElements/Card';

import "./QuoteList.css"
import QuoteItem from './QuoteItem';
import Button from '../../shared/components/FormElements/Button';


const QuoteList = props => {
    if (props.items.length <= 0) {
        return (
            <div className='quote-list center'> 
                <Card>
                    <h2>No quotes found, create?</h2>
                    <Button to="/quotes/new">Share</Button>
                </Card>
            </div>
        );
    } else {
        return (
            <ul className="quote-list">
                {props.items.map(quote => ( 
                        <QuoteItem 
                            key={quote.id} 
                            id={quote.id} 
                            text={quote.text} 
                            author_name={quote.author.name}
                            author_ref_url={quote.author.ref_url}
                            author_ref_img={quote.author.ref_img}
                            author_id={quote.author.id}
                            tags={quote.tags} 
                            // title={quote.title} 
                            // description={quote.description} 
                            // address={quote.address} 
                            creatorId={quote.creator.id} 
                            creatorName={quote.creator.name} 
                            // coordinates={quote.location} 
                            onDelete={props.onDeleteQuote}
                        />
                    )
                )}
            </ul>
        );
    }
}

export default QuoteList;
