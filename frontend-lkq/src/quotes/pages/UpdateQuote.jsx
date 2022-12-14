import React, { useState, useEffect, useCallback, useContext, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from '../../shared/hooks/FormHook';
import { useHttpClient } from '../../shared/hooks/HttpClientHook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import { 
    VALIDATOR_REQUIRE,
    // VALIDATOR_MINLENGTH, 
} from '../../shared/util/validators';
import { AuthContext } from '../../shared/context/AuthContext';
import './QuoteForm.css'


const UpdateQuote = () => {
    const currentAuth = useContext(AuthContext);

    const {isLoading, clientError, sendRequest, clearClientError} = useHttpClient();

    const [loadedQuote, setLoadedQuote] = useState(undefined);

    const quoteId = useParams().quoteId;

    const [formState ,inputHandler, setFormData] = useForm({
        text: {
            value: '',
            isValid: true
        },
        author: {
            value: '',
            isValid: true
        },      
        tags: {
            value: '',
            isValid: true
        },
        isPublic: {
            value: Boolean(false),
            isValid: true
        }      
    }, true);
    
    
    const fetchQuote = useCallback(async fetchedQuoteId =>  {
        try {
            const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_API_ADDRESS}/api/quotes/${fetchedQuoteId}`);
            setLoadedQuote({
                userId: responseData.quote.creator.id,
                text: responseData.quote.text,
                author: responseData.quote.author.name,
                tags: responseData.quote.tags.map((e,i) => (i > 0 ? ' ' : '') + e.name).toString(),
                isPublic: responseData.quote.isPublic
            });
            setFormData(
                {
                    text: {
                        value: !!loadedQuote ? loadedQuote.text.toString() : '',
                        isValid: true
                    },
                    author: {
                        value: !!loadedQuote ? loadedQuote.author.toString() : '',
                        isValid: true
                    },      
                    tags: {
                        value: !!loadedQuote ? loadedQuote.tags.toString() : '',
                        isValid: true
                    },
                    isPublic: {
                        value: !!loadedQuote ? loadedQuote.isPublic : false,
                        isValid: true
                    }  
                }, 
            true);
        } catch (error) {
            throw(error)
        }
    }, [sendRequest, setFormData]);

    useEffect(() => {
        fetchQuote(quoteId);
    }, [fetchQuote, quoteId] );
/*

useEffect(() => {

        const fetchQuote = async () => {
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_API_ADDRESS}/api/quotes/${quoteId}`);
                setLoadedQuote({
                    userId: responseData.quote.creator.id,
                    text: responseData.quote.text,
                    author: responseData.quote.author.name,
                    tags: responseData.quote.tags.map((e,i) => (i > 0 ? ' ' : '') + e.name).toString(),
                    isPublic: responseData.quote.isPublic
                });
                setFormData(
                    {
                        text: {
                            value: !!loadedQuote ? loadedQuote.text.toString() : '',
                            isValid: true
                        },
                        author: {
                            value: !!loadedQuote ? loadedQuote.author.toString() : '',
                            isValid: true
                        },      
                        tags: {
                            value: !!loadedQuote ? loadedQuote.tags.toString() : '',
                            isValid: true
                        },
                        isPublic: {
                            value: !!loadedQuote ? loadedQuote.isPublic : false,
                            isValid: true
                        }  
                    }, 
                true);
            } catch (error) {
                throw(error)
            }
        };
        fetchQuote();

    }, [sendRequest, quoteId] );

*/

    const navigate = useNavigate();



    const submitHandler = async event => {
        event.preventDefault();
        let tagsString = String(formState.inputs.tags.value.length > 0 ? formState.inputs.tags.value : '');
        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_API_ADDRESS}/api/quotes/${quoteId}`,
                'PATCH',
                JSON.stringify({
                    text: formState.inputs.text.value,
                    author: formState.inputs.author.value,
                    tags: tagsString,
                    isPublic: formState.inputs.isPublic.value.toString()
                }),
                { 
                    'Content-Type': 'application/json', 
                    Authorization: `Bearer ${currentAuth.token}` 
                }
            );
            navigate(`/quotes/quote/${quoteId.toString()}`)
        } catch (error) {
            console.error(error);
            throw(error);
        };

    };


    if (isLoading) { return <div className='center'><LoadingSpinner /></div> }

    if (!loadedQuote && !clientError) { return <Card><h2>NO PLACE</h2></Card> }
    

    return (
        <Fragment>
            <ErrorModal error={clientError} onClear={clearClientError}/>
            {isLoading && <LoadingSpinner asOverlay />}
            { !isLoading && loadedQuote && <form className="quote-form" onSubmit={submitHandler}>
                <Input
                    id="text"
                    type="textarea"
                    label="Quotation"
                    placeholder="type here/do not include enclosing quotation marks..."
                    validators={[VALIDATOR_REQUIRE()]}
                    value={loadedQuote.text}
                    onInput={inputHandler}
                    rows={5}
                    noResize
                />
                <Input
                    id="author"
                    type="text"
                    label="Author"
                    placeholder="type here..."
                    validators={[]}
                    value={loadedQuote.author}
                    onInput={inputHandler}
                    noResize
                />
                <Input
                    id="tags"
                    type="text"
                    label="Categories/Tags"
                    placeholder="type keyword/keyphrase tags, separated by commas..."
                    validators={[]}
                    onInput={inputHandler}
                    value={loadedQuote.tags}
                    noResize
                />
                <Input
                    id="isPublic"
                    type="checkbox"
                    label="Public"
                    validators={[]}
                    onInput={inputHandler}
                    value={loadedQuote.isPublic}
                    defaultChecked={loadedQuote.isPublic}
                    noResize
                />
                <div>
                <Button type="submit" disabled={!loadedQuote}>Update</Button>
                <Button dangerinverse type="button" onClick={() => { navigate(-1) }} >Cancel</Button>
                </div>
            </form>}
        </Fragment>

    );
}

export default UpdateQuote;
