import React, { useState, useContext, Fragment } from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { VALIDATOR_REQUIRE, VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_PASSWORD_MATCH } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/FormHook';
import { useHttpClient } from '../../shared/hooks/HttpClientHook';
import { AuthContext } from '../../shared/context/AuthContext';
import './Auth.css';

const Auth = () => {
    const PW_MIN_LENGTH = 8;
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
                confirmPassword: undefined
            }, formState.inputs.email.isValid && formState.inputs.password.isValid);
        } else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                confirmPassword: {
                    value: '',
                    isValid: false
                }
            }, false);
        };
        setIsLoginMode(prev => !prev)
    };

    const authSubmitHandler = async event => {
        event.preventDefault();
        console.log(`${process.env.REACT_APP_BACKEND_API_ADDRESS}/api/users/signup`)

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
                auth.login(responseData.name, responseData.email, responseData.userId, responseData.isAdmin, responseData.token);
            } catch (err) { }
        } else {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_API_ADDRESS}/api/users/signup`,
                    'POST',
                    JSON.stringify({
                        name: formState.inputs.name.value,
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {"Content-Type": "application/json"}
                );
                auth.login(responseData.name, responseData.email, responseData.userId, responseData.isAdmin, responseData.token);
            } catch (err) { }
        }
    };



    return (
        <Fragment>
            <h2 className="authentication__header"> Login/Signup</h2>
            <ErrorModal error={clientError} onClear={clearClientError} />
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay />}
                <h2> {!isLoginMode ? "Signup" : "Login"} Required</h2>
                <form onSubmit={authSubmitHandler}>
                    {!isLoginMode && (
                        <Input
                            id="name"
                            type="name"
                            label="Name"
                            placeholder="type here..."
                            validators={[VALIDATOR_REQUIRE()]}
                            onInput={inputHandler}
                            noResize
                        />
                    )}

                    <Input
                        id="email"
                        type="email"
                        label="Email Address"
                        placeholder="type here..."
                        autoComplete="new-password"
                        validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
                        onInput={inputHandler}
                        noResize
                    />
                    <Input
                        id="password"
                        type="password"
                        label="Password"
                        placeholder="type here..."
                        autoComplete="off"
                        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(PW_MIN_LENGTH)]}
                        onInput={inputHandler}
                        noResize
                    />{!isLoginMode && (
                        <Input
                            id="confirmPassword"
                            type="password"
                            label="Re-enter Password"
                            placeholder="type here..."
                            autoComplete="off"
                            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(PW_MIN_LENGTH), VALIDATOR_PASSWORD_MATCH(formState.inputs.password.value)]}
                            onInput={inputHandler}
                            noResize
                        />
                    )}


                    <Button type="submit" disabled={!formState.isValid}>{!isLoginMode ? "Sign-Up" : "Login"}</Button>
                </form>
                <Button inverse onClick={switchModeHandler}>Switch to {isLoginMode ? "Sign-Up" : "Login"}</Button>
            </Card>
        </Fragment>
    );
};

export default Auth;