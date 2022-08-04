import React, { useState, useEffect, useContext, Fragment } from 'react';
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
    VALIDATOR_MINLENGTH, 
} from '../../shared/util/validators';
import { AuthContext } from '../../shared/context/AuthContext';
import './QuoteForm.css'


const UpdateQuote = () => {

    const currentAuth = useContext(AuthContext);

    const {isLoading, clientError, sendRequest, clearClientError} = useHttpClient();

    const [loadedQuote, setLoadedQuote] = useState(undefined);

    const quoteId = useParams().quoteId;

    console.log(`Quote id ${quoteId}`);

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
        }      
    }, true);
    
    
    useEffect(() => {

        const fetchQuote = async () => {
            try {
                const responseData = await sendRequest(`http://${window.location.hostname}:5000/api/quotes/${quoteId}`);
                
                setLoadedQuote({
                    userId: responseData.quote.creator,
                    text: responseData.quote.text,
                    author: responseData.quote.author.name,
                    tags: responseData.quote.tags.map((e,i,r) => e.name).toString(),
                });

                setFormData(
                    {
                        text: {
                            value: loadedQuote.text.toString(),
                            isValid: true
                        },
                        author: {
                            value: loadedQuote.author.toString(),
                            isValid: true
                        },      
                        tags: {
                            value: loadedQuote.tags.toString(),
                            isValid: true
                        }      
                    }, 
                true);
            } catch (error) {
                console.error(error);
                throw(error)
            }
        };
        fetchQuote();

    }, [sendRequest, quoteId]);


    const navigate = useNavigate();

    const submitHandler = async event => {
        event.preventDefault();
        console.log("formState.inputs.tags.value", formState.inputs.tags.value, typeof(formState.inputs.tags.value))
        console.log("formState.inputs.tags.value.length", formState.inputs.tags.value.length)
        let tagsString = String(formState.inputs.tags.value.length > 0 ? formState.inputs.tags.value : '');
        try {
            await sendRequest(
                `http://${window.location.hostname}:5000/api/quotes/${quoteId}`,
                'PATCH',
                JSON.stringify({
                    text: formState.inputs.text.value,
                    author: formState.inputs.author.value,
                    tags: tagsString
                }),
                { 
                    'Content-Type': 'application/json', 
                    Authorization: `Bearer ${currentAuth.token}` 
                }
            );
            navigate(`/${loadedQuote.userId}/quotes`)
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
                    placeholder="type here..."
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
                    validators={[]}
                    onInput={inputHandler}
                    value={loadedQuote.tags}
                    noResize
                />
                <Button type="submit" disabled={!loadedQuote}>Update</Button>
            </form>}
        </Fragment>

    );
        {/* <Fragment>
            <ErrorModal error={clientError} onClear={clearClientError} />
            <form className="quote-form" onSubmit={quoteSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay />}
                <Input
                    id="text"
                    type="textarea"
                    label="Quotation"
                    placeholder="type here..."
                    validators={[VALIDATOR_REQUIRE()]}
                    onInput={inputHandler}
                    rows={5}
                    noResize
                />
                <Input
                    id="author"
                    type="text"
                    label="Author"
                    placeholder="type here..."
                    validators={[VALIDATOR_REQUIRE()]}
                    onInput={inputHandler}
                    noResize
                />
                <Input
                    id="tags"
                    type="text"
                    label="Categories/Tags"
                    validators={[]}
                    onInput={inputHandler}
                    noResize
                />
                <Button type="submit" disabled={!formState.isValid}>+ (quote)</Button>
            </form>
            </Fragment> */}


}

export default UpdateQuote;
