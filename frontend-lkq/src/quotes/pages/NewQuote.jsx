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
    }, false);

    const navigate = useNavigate();

    const quoteSubmitHandler = async event => {
        event.preventDefault();
        let tagsString = String(formState.inputs.tags.value.length > 0 ? formState.inputs.tags.value : '');
        try {
            const response = await sendRequest(
                `http://${window.location.hostname}:5000/api/quotes`, 
                'POST',
                JSON.stringify({
                    text: formState.inputs.text.value,
                    author: formState.inputs.author.value,
                    tags: tagsString,
                    isPublic: formState.inputs.isPublic.value.toString()
                }),
                {   
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${currentAuth.token}` 
                }
            );
            let exitRoute, exitId;
            console.log(response.quote._id)
            try {
                exitId = response.quote._id;
                exitRoute =`/quotes/${exitId}`;
            } catch (error) {
                exitRoute = `/quotes/user/${currentAuth.userId}` || `/quotes`;
                throw (error);
            } finally {
                navigate(exitRoute);;
            }
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
                    validators={[]}
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
                <Input
                    id="isPublic"
                    type="checkbox"
                    label="Public"
                    validators={[]}
                    onInput={inputHandler}
                    value={false}
                    defaultChecked={false}
                    noResize
                />
                <Button type="submit" disabled={!formState.inputs.text.isValid}> Add new quote </Button>
                <Button inverse type="button" onClick={() => { navigate(`/quotes/user/${currentAuth.userId}` || `/quotes`) }} >Cancel</Button>

            </form>
        </Fragment>
    );
}

export default NewQuote;
