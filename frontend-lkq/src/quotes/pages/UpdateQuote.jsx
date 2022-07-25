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


    const [formState ,inputHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        }
    }, false);
    
    
    useEffect(() => {

        const fetchQuote = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:5000/api/quotes/${quoteId}`);
                
                setLoadedQuote(responseData.quote);
                setFormData(
                    {
                        title: {
                            value: responseData.quote.title,
                            isValid: true
                        },
                        description: {
                            value: responseData.quote.description,
                            isValid: true
                        }      
                }              
                )
            } catch (error) {
                console.log(error)
            }
        };
        fetchQuote();

    }, [sendRequest, quoteId]);


    const navigate = useNavigate();

    const submitHandler = async event => {
        event.preventDefault();
        try {
            await sendRequest(
                `http://localhost:5000/api/quotes/${quoteId}`,
                'PATCH',
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value
                }),
                { 
                    'Content-Type': 'application/json', 
                    Authorization: `Bearer ${currentAuth.token}` 
                }
            );
            navigate(`/${currentAuth.userId}/quotes`)
        } catch (error) {};

    };


    if (isLoading) { return <div className='center'><LoadingSpinner /></div> }

    if (!loadedQuote && !clientError) { return <Card><h2>NO PLACE</h2></Card> }
    
    return (
        <Fragment>
            <ErrorModal error={clientError} onClear={clearClientError}/>
            { !isLoading && loadedQuote && <form className="quote-form" onSubmit={submitHandler}>
                <Input 
                    id="title"
                    type="text" 
                    label="Title" 
                    validators={[VALIDATOR_REQUIRE()]} 
                    onInput={inputHandler}
                    noResize
                    value={loadedQuote.title}
                    valid={true}
                />
                <Input 
                    id="description"
                    type="textarea" 
                    label="Description" 
                    validators={[VALIDATOR_REQUIRE()]} 
                    onInput={inputHandler}
                    rows={5}
                    noResize
                    value={loadedQuote.title}
                    valid={true}
                />
                <Button type="submit" disabled={!formState.isValid}>Update</Button>
            </form>}
        </Fragment>

    );
}

export default UpdateQuote;
