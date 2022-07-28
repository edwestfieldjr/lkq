import React, { useState, useContext, Fragment } from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import { VALIDATOR_REQUIRE, VALIDATOR_EMAIL, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/FormHook';
import { useHttpClient } from '../../shared/hooks/HttpClientHook';
import { AuthContext } from '../../shared/context/AuthContext';
import './Auth.css';

const Auth = () => {
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const { isLoading, clientError, sendRequest, clearClientError } = useHttpClient();
    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        },
    }, false);

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData({
                ...formState.inputs,
                name: undefined,
                image: undefined
            }, formState.inputs.email.isValid && formState.inputs.password.isValid);
        } else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image: {
                    value: null,
                    isValid: false,
                }
            }, false);
        };
        setIsLoginMode(prev => !prev)
    };


    // const authSubmitHandler = async event => {
    //     event.preventDefault();
    //     try {
    //         let api_url; 
    //         let formData = new FormData();
    //         formData.append("email", formState.inputs.email.value);
    //         formData.append("password", formState.inputs.password.value);
    //         if (isLoginMode) {
    //             api_url = `${process.env.REACT_APP_BACKEND_API_ADDRESS}/api/users/login`;
    //         } else {
    //             api_url = `${process.env.REACT_APP_BACKEND_API_ADDRESS}/api/users/signup`;
    //             formData.append("name", formState.inputs.name.value);
    //             formData.append("image", formState.inputs.image.value);
    //         };
    //         console.log(formState.inputs.email.value)
    //         console.log(formData.values());
    //         console.log(formData);
    //         const responseData = await sendRequest(
    //             api_url, 
    //             'POST',
    //             formData
    //         );
    //         console.log(responseData);
    //         auth.login(responseData.existingUser.id);
    //     } catch (error) {
    //         console.log(error)
    //     };
    // };

    const authSubmitHandler = async event => {
        event.preventDefault();

        if (isLoginMode) {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_API_ADDRESS}/api/users/login`,
                    'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                );
                auth.login(responseData.userId, responseData.token);
            } catch (err) { }
        } else {
            try {
                const formData = new FormData();
                formData.append('email', formState.inputs.email.value);
                formData.append('name', formState.inputs.name.value);
                formData.append('password', formState.inputs.password.value);
                formData.append('image', formState.inputs.image.value);
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_API_ADDRESS}/api/users/signup`,
                    'POST',
                    formData
                );

                auth.login(responseData.userId, responseData.token);
            } catch (err) { }
        }
    };



    return (
        <Fragment>
            <h2 className="authentication__header"> Login/Signup Page</h2>
            <ErrorModal error={clientError} onClear={clearClientError} />
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay />}
                <h2> {!isLoginMode ? "Signup" : "Login"} Required</h2>
                <form onSubmit={authSubmitHandler}>
                    {!isLoginMode && (
                        <Input
                            id="name"
                            type="name"
                            label="name"
                            placeholder="type here..."
                            validators={[VALIDATOR_REQUIRE()]}
                            onInput={inputHandler}
                            noResize
                        />
                    )}
                    {!isLoginMode && <ImageUpload id="image" onInput={inputHandler} errorText="Please select an image." center />}
                    <Input
                        id="email"
                        type="email"
                        label="Email"
                        placeholder="type here..."
                        validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
                        onInput={inputHandler}
                        noResize
                    />
                    <Input
                        id="password"
                        type="password"
                        label="password"
                        placeholder="type here..."
                        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(8, `PW must be at least 8 characters `)]}
                        onInput={inputHandler}
                        rows={5}
                        noResize
                    />


                    <Button type="submit" disabled={!formState.isValid}>{!isLoginMode ? "Sign-Up" : "Login"}</Button>
                </form>
                <Button inverse onClick={switchModeHandler}>Switch to {isLoginMode ? "Sign-Up" : "Login"}</Button>
            </Card>
        </Fragment>
    );
};

export default Auth;