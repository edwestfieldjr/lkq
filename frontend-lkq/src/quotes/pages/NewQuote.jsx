import React, { useContext, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../shared/hooks/FormHook';
import { useHttpClient } from '../../shared/hooks/HttpClientHook';
import { AuthContext } from '../../shared/context/AuthContext';
import {
    VALIDATOR_REQUIRE,
    // VALIDATOR_MINLENGTH,
    // VALIDATOR_MAXLENGTH,
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
                `${process.env.REACT_APP_BACKEND_API_ADDRESS}/api/quotes`, 
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
            try {
                exitId = response.quote._id;
                exitRoute =`/quotes/quote/${exitId}`;
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


    return (
        <Fragment>
            <ErrorModal error={clientError} onClear={clearClientError} />
            <form className="quote-form" onSubmit={quoteSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay />}
                <Input
                    id="text"
                    type="textarea"
                    label="Quotation"
                    placeholder="type here/do not include enclosing quotation marks..."
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
                    placeholder="type keyword/keyphrase tags, separated by commas..."
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
                <Button dangerinverse type="button" onClick={() => { navigate(-1) }} >Cancel</Button>

            </form>
        </Fragment>
    );
}

export default NewQuote;
