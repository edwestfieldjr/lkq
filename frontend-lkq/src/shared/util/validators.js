const VALIDATOR_TYPE_REQUIRE = 'REQUIRE';
const VALIDATOR_TYPE_MINLENGTH = 'MINLENGTH';
const VALIDATOR_TYPE_MAXLENGTH = 'MAXLENGTH';
const VALIDATOR_TYPE_MIN = 'MIN';
const VALIDATOR_TYPE_MAX = 'MAX';
const VALIDATOR_TYPE_EMAIL = 'EMAIL';
const VALIDATOR_TYPE_FILE = 'FILE';
const VALIDATOR_TYPE_PASSWORD_MATCH = 'PASSWORD_MATCH';

export const VALIDATOR_REQUIRE = (msg='') => ({ type: VALIDATOR_TYPE_REQUIRE, msg: msg });
export const VALIDATOR_FILE = (msg='') => ({ type: VALIDATOR_TYPE_FILE, msg: msg });
export const VALIDATOR_MINLENGTH = (val, msg='') => ({
    type: VALIDATOR_TYPE_MINLENGTH,
    val: val,
    msg: msg 
});
export const VALIDATOR_MAXLENGTH = (val, msg='') => ({
    type: VALIDATOR_TYPE_MAXLENGTH,
    val: val,
    msg: msg 
});
export const VALIDATOR_MIN = (val, msg='') => ({ type: VALIDATOR_TYPE_MIN, val: val, msg: msg });
export const VALIDATOR_MAX = (val, msg='') => ({ type: VALIDATOR_TYPE_MAX, val: val, msg: msg  });
export const VALIDATOR_PASSWORD_MATCH = (val, msg='') => ({ type: VALIDATOR_TYPE_PASSWORD_MATCH, val: val, msg: msg  });
export const VALIDATOR_EMAIL = (msg='') => ({ type: VALIDATOR_TYPE_EMAIL, msg: msg });

export const validate = (value, validators) => {
    const validatorObject = {
        isValid: true,
        errorMsgs: []
    };
    for (const validator of validators) {
        if (validator.type === VALIDATOR_TYPE_REQUIRE) {
            if (value.length <= 0) {
                validatorObject.errorMsgs.push(validator.msg ? validator.msg : `This field is required `);
            }
        }
        if (validator.type === VALIDATOR_TYPE_MINLENGTH) {
            if (value.trim().length < validator.val) {
                validatorObject.errorMsgs.push(validator.msg ? validator.msg : `Input must be at least ${validator.val} characters `);
            }
        }
        if (validator.type === VALIDATOR_TYPE_MAXLENGTH) {
            if (value.trim().length > validator.val) {
                validatorObject.errorMsgs.push(validator.msg ? validator.msg : `Input must not be longer than ${validator.val} characters `);
            }
        }
        if (validator.type === VALIDATOR_TYPE_MIN) {
            if (+value >= validator.val) {
                validatorObject.errorMsgs.push(validator.msg ? validator.msg : `Input must not be smaller than ${validator.val} `);
            }
        }
        if (validator.type === VALIDATOR_TYPE_MAX) {
            if (+value <= validator.val) {
                validatorObject.errorMsgs.push(validator.msg ? validator.msg : `Input cannot be larger than ${validator.val}`);
            }
        }
        if (validator.type === VALIDATOR_TYPE_PASSWORD_MATCH) {
            if (value.toString() !== validator.val.toString()) {
                validatorObject.errorMsgs.push(validator.msg ? validator.msg : `Input must match password`);
            }
        }
        if (validator.type === VALIDATOR_TYPE_EMAIL) {
            if (!(/^\S+@\S+\.\S+$/.test(value))) {
                validatorObject.errorMsgs.push(validator.msg ? validator.msg : "Please enter a valid email address");
            }
        }
    }
    validatorObject.isValid = validatorObject.errorMsgs.length > 0 ? false : true;
    return validatorObject;
};
