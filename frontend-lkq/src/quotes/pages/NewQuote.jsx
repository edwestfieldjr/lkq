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
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        address: {
            value: '',
            isValid: false
        },
        image: {
            value: null,
            isValid: false
        }
    }, false);

    const navigate = useNavigate();

    const quoteSubmitHandler = async event => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', formState.inputs.title.value);
            formData.append('description', formState.inputs.description.value);
            formData.append('address', formState.inputs.address.value);
            formData.append('image', formState.inputs.image.value);
            await sendRequest(`${process.env.REACT_APP_BACKEND_API_ADDRESS}/api/quotes`, 'POST', formData, {
                Authorization: `Bearer ${currentAuth.token}` 
            });
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };


    // const

    return (
        <Fragment>
            <ErrorModal error={clientError} onClear={clearClientError} />
            <form className="quote-form" onSubmit={quoteSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay />}
                <Input
                    id="title"
                    type="text"
                    label="Title"
                    placeholder="type here..."
                    validators={[VALIDATOR_REQUIRE()]}
                    onInput={inputHandler}
                    noResize
                />
                <Input
                    id="description"
                    type="textarea"
                    label="Description"
                    placeholder="type here..."
                    validators={[VALIDATOR_REQUIRE()]}
                    onInput={inputHandler}
                    rows={5}
                    noResize
                />
                <Input
                    id="address"
                    type="text"
                    label="Address"
                    validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5, "please enter a valid street address.")]}
                    onInput={inputHandler}
                    noResize
                />
                <ImageUpload id="image" onInput={inputHandler} errorText="Please select an image." />
                <Button type="submit" disabled={!formState.isValid}>+ (quote)</Button>
            </form>
        </Fragment>
    );
}

export default NewQuote;
