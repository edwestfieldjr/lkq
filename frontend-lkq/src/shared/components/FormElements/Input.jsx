import React, { useReducer, useEffect } from 'react';

import { validate } from '../../util/validators';
import "./Input.css"

const inputReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE':
            const {isValid, errorMsgs} = validate(action.val, action.validators)
            return {
                ...state,
                value: action.val,
                isValid: isValid,
                errorMsgs: errorMsgs
            };
        case 'TOUCH':
            return { ...state, isTouched: true };
        default:
            return state;
    }
}

const Input = props => {

    const [inputState, dispatchInputState] = useReducer(inputReducer, {
        value: props.value || '', 
        isValid: props.valid || false, 
        isTouched: false, 
        errorMsgs: [] });

    const   { id, onInput } = props, 
            { value, isValid, errorMsgs, isTouched } = inputState;
    
    useEffect(() => {
        onInput(id, value, isValid)
    }, [id, value, isValid, onInput, errorMsgs, isTouched ]);

    const changeHandler = event => {
        dispatchInputState({
            type: 'CHANGE', 
            val: event.target.value,
            validators: props.validators
        })
    };

    const touchHandler = event => {
        dispatchInputState({ type: 'TOUCH' });
        changeHandler(event);
    };

    const InputElement = props.type === "textarea" ? "textarea" : "input";

    return (
        <div className={`form-control ${(!inputState.isValid && inputState.isTouched) && 'form-control--invalid'} `}>
            <label htmlFor={props.id}>{props.label}</label>
            <InputElement
                id={props.id}
                name={props.name}
                type={props.type !== "textarea" ? props.type : null}
                placeholder={props.placeholder || null}
                rows={props.rows || (Element === "textarea" ? 3 : null)}
                onChange={changeHandler}
                onBlur={touchHandler}
                value={inputState.value}
                style={props.noResize && {resize: 'none'}}
            />
            {(inputState.errorMsgs && inputState.isTouched) && <ul style={{textAlign: 'left'}}>{errorMsgs.map((errMsg, idx) => <li key={idx}className='form-control--invalid'>{errMsg}</li>)}</ul>}
        </div>
    );
}

export default Input;
