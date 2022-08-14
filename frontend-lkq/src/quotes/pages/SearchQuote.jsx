import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../shared/hooks/FormHook';
import { useHttpClient } from '../../shared/hooks/HttpClientHook';
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



const SearchQuote = () => {
    const { isLoading, clientError, /* sendRequest,  */clearClientError } = useHttpClient();

    const [formState, inputHandler] = useForm({
        text: {
            value: '',
            isValid: false
        },
    }, false);

    const navigate = useNavigate();

    const searchSubmitHandler = async event => {
        event.preventDefault();
        try {
            const searchRoute =  formState.inputs.text.value ? `/quotes/search/${formState.inputs.text.value}` : `/quotes`;
            navigate(searchRoute);;
        } catch (error) {
            throw (error);
        }
    };



    return (
        <Fragment>            
            <h2 className="center">Search</h2>

            <ErrorModal error={clientError} onClear={clearClientError} />
            <form className="quote-form" onSubmit={searchSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay />}
                <Input
                    id="text"
                    type="text"
                    label="Enter Search term"
                    placeholder="type here..."
                    validators={[VALIDATOR_REQUIRE()]}
                    onInput={inputHandler}
                    noResize
                />
                <Button type="submit" disabled={!formState.inputs.text.isValid}> Search </Button>
                <Button dangerinverse type="button" onClick={() => { navigate(-1) }} >Cancel</Button>

            </form>
        </Fragment>
    );
}

export default SearchQuote;
