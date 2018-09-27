/**
 * @method isString
 * @description Validates that a value is a string
 * @param {unknown} value - possibly a string
 * @returns {boolean} returns true if value is a string else false
 */
export const isString = value => typeof value === 'string';

/**
 * @method isNumber
 * @description Validates that a value is a number
 * @param {unknown} value - possibly a number
 * @returns {boolean} returns true if value is a number else false
 */
export const isNumber = value => typeof value === 'number';

/**
 * @function isPositiveInteger
 * @description Validates that a value parses to an integer successfully
 * @param {unknown} value - possibly integer valued
 * @returns {boolean} returns true if it parses to an integer else false
 */
export const isPositiveInteger = (value) => {
  const stringValue = String(value);
  return !stringValue.includes('.') &&
    /^[1-9][0-9]*$/.test(stringValue.replace(/^0/, ''));
};

/**
 * @method doesPropertyExist
 * @description Validates that a value is not undefined
 * @param {string} value - possibly undefined value
 * @returns {boolean} returns true if value is not undefined else false
 */
export const doesPropertyExist = value => value !== undefined;

/**
 * @method isObject
 * @description Validates that a value is an object
 * @param {unknown} value - possibly an object
 * @returns {boolean} returns true if value is an object else false
 */
export const isObject = (value) => {
  const type = Object.prototype.toString;
  return type.call(value) === type.call({});
};

/**
 * @method isLetters
 * @description Validates that a value constains only alphabets
 * @param {unknown} value - possibly all letters
 * @returns {boolean} returns true if value contain letters only else false
 */
export const isLetters = value => /^[A-Za-z]+$/.test(value);

/**
 * @method isEmail
 * @description Validates that a value has an email pattern
 * @param {unknown} value - possibly an email
 * @returns {boolean} returns true if value is an email else false
 */
export const isEmail = value => /^\w+@\w+\.\w+$/.test(value);

/**
 * @method isAlphaNumeric
 * @description Validates that a value constains only letters and numbers
 * @param {string} value - possibly alphanumeric
 * @returns {boolean} returns true if value is alphanumeric else false
 */
export const isAlphaNumeric = value => /^\w+$/.test(value);
