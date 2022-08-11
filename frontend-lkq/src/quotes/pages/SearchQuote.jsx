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



const SearchQuote = () => {
    const currentAuth = useContext(AuthContext);
    const { isLoading, clientError, sendRequest, clearClientError } = useHttpClient();

    const [formState, inputHandler] = useForm({
        text: {
            value: '',
            isValid: false
        },
    }, false);

    const navigate = useNavigate();

    const searchSubmitHandler = async event => {
        event.preventDefault();
        // // let tagsString = String(formState.inputs.tags.value.length > 0 ? formState.inputs.tags.value : '');
        try {
        //     const response = await sendRequest(
        //         `http://${window.location.hostname}:5000/api/quotes/search/${searchterm}`, 
        //         'GET',
        //         JSON.stringify({
        //             text: formState.inputs.text.value,
        //         }),
        //         {   
        //             "Content-Type": "application/json",
        //             // Authorization: `Bearer ${currentAuth.token}` 
        //         }
        //     );
        //     let exitRoute, exitId;
        //     console.log(response.quote._id)
        //     try {
        //         exitId = response.quote._id;
        //         exitRoute =`/quotes/terms/${exitId}`;
            // } catch (error) {
            const searchRoute = `/quotes/search/${formState.inputs.text.value}` || `/quotes`;
            console.log(searchRoute)
            //     throw (error);
            // } finally {
            navigate(searchRoute);;
            // }
        } catch (error) {
            throw (error);
        }
    };


    // const

    return (
        <Fragment>
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
                <Button dangerinverse type="button" onClick={() => { navigate(`/quotes/user/${currentAuth.userId}` || `/quotes`) }} >Cancel</Button>

            </form>
        </Fragment>
    );
}

export default SearchQuote;
