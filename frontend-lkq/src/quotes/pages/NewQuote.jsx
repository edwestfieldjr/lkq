import React, { useContext, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../shared/hooks/FormHook';
import { useHttpClient } from '../../shared/hooks/HttpClientHook';
import { AuthContext } from '../../shared/context/AuthContext';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH,
    VALIDATOR_MAXLENGTH,
} from '../../shared/util/validators';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';

import "./QuoteForm.css"



const NewQuote = () => {
    const currentAuth = useContext(AuthContext);
    const { isLoading, clientError, sendRequest, clearClientError } = useHttpClient();

    const [formState, inputHandler] = useForm({
        text: {
            value: '',
            isValid: false
        },
        author: {
            value: '',
            isValid: false
        },
        tags: {
            value: '',
            isValid: true
        }
    }, false);

    const navigate = useNavigate();

    const quoteSubmitHandler = async event => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('text', formState.inputs.text.value);
            formData.append('author', formState.inputs.author.value);
            formData.append('tags', formState.inputs.tags.value);
            await sendRequest(`http://${window.location.hostname}:5000/api/quotes`, 'POST', (
                JSON.stringify({
                    text: formState.inputs.text.value,
                    author: formState.inputs.author.value,
                    tags: formState.inputs.tags.value
                })
            ),
            {   "Content-Type": "application/json",
                Authorization: `Bearer ${currentAuth.token}` 
            });
            navigate('/allquotes');
            // navigate('/');
        } catch (error) {
            throw (error);
        }
    };


    // const

    return (
        <Fragment>
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
        </Fragment>
    );
}

export default NewQuote;
