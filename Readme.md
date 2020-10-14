[![Tests on Github](https://github.com/marmelab/checkoid/workflows/Tests/badge.svg)](https://github.com/marmelab/checkoid/actions?query=workflow%3ATests) ![GitHub top language](https://img.shields.io/github/languages/top/marmelab/checkoid.svg) ![GitHub contributors](https://img.shields.io/github/contributors/marmelab/checkoid.svg) ![checkoid.svg](https://img.shields.io/github/license/marmelab/checkoid.svg) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)[![Code of Conduct](https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square)](https://github.com/marmelab/checkoid/blob/master/CODE_OF_CONDUCT.md)

Checkoid is a validator library with zero dependencies that allows to combine validator like you would lego piece.

## Usage
You can create simple validator:
Simply pass a function, that either return a value for an error, or nothing if the value is valid.

```js
import { validator } = from 'checkoid';

const isEmail = validator((value) => {
    if (/@/.test(value)) {
        return;
    }
    return 'value must be an email';
});
const isNotGmail = validator((value) => {
    if (/gmail.com/.test(value)) {
        return 'value must not be a gmail adress';
    }
});

isEmail.check('test@gmail.com'); // undefined
isNotGmail.check('test@gmail.com'); 
// [{ message: 'value must not be a gmail adress', value: 'test@gmail.com' }]
isEmail.check('whatever');
// [{ message: 'value must be an email', value: 'whatever' }]
isNotGmail.check('whatever');
// [{ message: 'value must not be a gmail adress', value: 'whatever' }]
```

And then combine them with `and`

```js
const isEmailNotFromGMail = isEMail.and(isNotGmail);
isEmailNotFromGMail.check('whatever');
// [
//    { message: 'value must be an email', value: 'whatever' },
//    { message: 'value must not be a gmail adress', value: 'test@gmail.com' }
// ]
isEmailNotFromGMail.check('test@gmail.com'); 
// [{ message: 'value must not be a gmail adress', value: 'test@gmail.com' }]
isEmailNotFromGMail.check('test@free.fr'); // undefined
```

Or with or

```js
const isEmpty = validator((value) => {
    if (!!value) {
        return 'value is not empty';
    }
});

const isOptionalEmail = isEmail.or(isEmpty);

isOptionalEmail.check(''); // undefined
isOptionalEmail.check('test@gmail.com'); // undefined
isOptionalEmail.check('invalid mail');
// [
//     { message: 'value must be an email', value: 'invalid mail' },
//     { message: ''value is not empty'', value: 'invalid mail' }
// ]
```

You can validate object too

```js
import { shape } = from 'checkoid';

const isGreaterThan = length => validator(value => {
    if (value && value.length <= length) {
        return `value must be at least ${length} characters long`;
    }
})

// objectValidator takes an object of other validator and returns a validator
const validateUser = shape({
    email: isEmail.or(isAbsent),
    password: isGreaterThan(8),
});

validateUser.check({ email: 'john@gmail.com', password: 'shouldnotdisplaythis' }) // undefined
validateUser.check({ email: 'john@gmail.com', password: 'secret' })
// [{ key: ['password'], message: 'value must be at least 8 characters long', value: 'secret' }]
validateUser.check('Hi I am John a valid user')
// [{ message: 'value must be an object', value: 'Hi I am John a valid user' }]
```

Or array

```js
import { arrayOf } from 'checkoid';

// listValidator take any validator and apply it to a list of value
const isEmailList = arrayOf(isEmail);

isEmailList.check([]); // undefined
isEmailList.check(['test@test.com', 'john@doe.com']); // undefined
isEmailList.check(['test@test.com', 'I am a valid email', 'john@doe.com']);
// [{ key: [1], message: 'value must be an email', value: 'I am a valid email' }]
isEmailList.check('I am an email list'); // [{ message: 'value must be an array', value: 'I am an email list' }]
```

Or array of object

```js
import { arrayOf } from 'checkoid';
const isUserList = arrayOf(validateUser);

isUserList.check([]); // undefined
isUserList.check([
    { email: 'john@gmail.com', password: 'shouldnotdisplaythis' },
    { email: 'jane@gmail.com', password: 'mySecretPassword' },
]); // undefined
isUserList.check([
    { email: 'john@gmail.com', password: 'shouldnotdisplaythis' },
    'I am an user',
    { email: 'jane@gmail.com', password: '1234' },
]); 
// [
//    { key: [1], mesage: 'value is not an object', value: 'I am an user' },
//    { key: [2, 'password'], message: 'value must be at least 8 characters long', value: '1234' },
// ]
```

In short all validators can be combined together, and you will always get back a Validator.

It is also possible to create asynchronous Validator

```js
import { asyncValidator } = from 'checkoid';

const doesUserIdExists = asyncValidator(async value => {
    const user = await fetchUser(value);
    if (user) {
        return;
    }

    return 'There is no user with this id';
});

// with an asynchronous validator the check method return a promise
await doesUserIdExists.check('badId');
// [{ message: 'There is no user with this id', value: 'badId' }]
await doesUserIdExists.check('goodId'); // undefined'
```

Asynchronous Validators can be combined exactly like synchronous ones. They can even be combined with synchronous Validator.
Simply as soon as an asynchronous Validator get combined with other synchronous Validator, the resultant validator will automatically become asynchronous.

## Documentation

### validator

Function to create a validator. It takes a simple validation function that take a value and returns either undefined when the value is valid or an invalid message when the value is not.

```js
import { validator } from 'checkoid';
const isEqual10 = validator(value => value === 10 ? undefined : 'value must be 10');
isEqual10.check(10) // undefined
isEqual10.check(5) // [{ message: 'value must be 10', value: 5 }]
```

### asyncValidator

Function to create a validator from an async validation function. It takes a simple validation async function that takes a value and returns a promise holding either undefined when the value is valid or an invalid message when the value is not.


```js
import { asyncValidator } from 'checkoid';

const doesUserIdExists = asyncValidator(async value => {
    const user = await fetchUser(value);
    if (user) {
        return;
    }

    return 'There is no user with this id';
});

// with an async validator the check method return a promise
await doesUserIdExists.check('badId');
// [{ message: 'There is no user with this id', value: 'badId' }]
await doesUserIdExists.check('goodId'); // undefined'
```

### The Validator object

All exported value in checkoid are either Validator or function that returns a Validator.
The validator object possess the following methods.

#### check
Takes a value and either returns undefined if it pass the validation or an array of object describing the issues otherwise.
The array contains an object for each validation function that returned an issue.

If the validator is async, the result will get wrapped inside a promise

It possess the following preoperty :

- message: The message returned by the validation function
- value: The value that has been tested. In the case of a shape or arrayOf validator this will be the targeted nested value and not the whole object or array.
- key: Optional, the key of the value being tested if applyable

#### and
Takes another validator and returns a new validator that apply the validations of both validator. All error will get concatenated.

```js
import { isGt, isNumber } from 'checkoid';
const isGt3 = isGt(3).and(isNumber);
isGt3.check(4); // undefined
isGt3.check(1); 
// [
//    { message: 'value must be greater than 3', value: 1 },
// ]
isGt3.check('four); 
// [
//    { message: 'value must be greater than 3', value: 'four' },
//    { message: 'value must be a number', value: 'four' },
// ]
```

#### or
Takes another validator and returns a new validator that apply the validations of both validator. It will only return the errors if both validator are invalid. If one of the two pass, the error of the other one will get ignored.


```js
import { validator, match } from 'checkoid';

const isEmail = validator((value) => {
    if (/@/.test(value)) {
        return;
    }
    return 'value must be an email';
});
const isEmpty = validator((value) => {
    if (!!value) {
        return 'value is not empty';
    }
});

const isOptionalEmail = isEmail.or(isEmpty);

isOptionalEmail.check(''); // undefined
isOptionalEmail.check('test@gmail.com'); // undefined
isOptionalEmail.check('invalid mail');
// [
//     { message: 'value must be an email', value: 'invalid mail' },
//     { message: 'value is not empty', value: 'invalid mail' }
// ]
```

#### format
Takes a function that receives all error object for the given validator and allow to return a new message. 
This allows to change the message part of the return value.
This function returns a new validator.

```js
const isEmail = match(/@/).format(({ message, value }) => `value: "${value}" is not a valid email`);


isEmail.check('test@gmail.com'); // undefined
isEmail.check('whatever');
// [{ message: 'value: "whatever" is not a valid email', value: 'whatever' }]
```

#### beforeHook
Takes a function that will be applyed to the tested value before the validation function. This allows to sanitize the value.
This function returns a new validator.

```js
import { hasLengthGt } from 'checkoid';
const isLongerThan8 = hasLengthGt(8).beforeHook(value => value.trim());

isLongerThan8.check('   hey     ');
// [{ message: 'value must have a length greater than 8', value: 'hey' }]

```

#### afterHook
Advanced usage only.
This works like format, but instead of allowing to change the message, it allows to changes the whole error object.
If you decide you need this, keep the message, value and key property on the object. 

#### map
Internal function please ignore. If you use this I sure hope you know what you are doing. Otherwise things will break.

#### chain
Internal function please ignore. If you use this I sure hope you know what you are doing. Otherwise things will break.


### basic validators
Checkoid provides the following basic validator to check basic type. Thy are stright forward.

- isNumber: check the value is a number
- isString: check the value is a string
- isBoolean: check the value is a boolean
- isObject: check the value is a object
- isArray: check the value is a array
- isTrue: check the value is `true`
- isFalse: check the value is `false`


### validator factory
Checkoid provides the following validator factory function that returns validator.

#### isGt
Take a minimum value and returns a validator that check if the value is greater than the given minimum value

```js
import { isGt } from 'checkoid';
const isGreaterThanFive = isGt(5);
isGreaterThanFive.check(6); // undefined
isGreaterThanFive.check(1); // [{ message: 'value must be greater than 5', value: 1 }]
```

#### isGte
Take a minimum value and returns a validator that check if the value is greater or equal than the given minimum value

```js
import { isGte } from 'checkoid';
const isAtLeastFive = isGte(5);
isAtLeastFive.check(6); // undefined
isAtLeastFive.check(1); // [{ message: 'value must be at least 5', value: 1 }]
```

#### isLt
Take a maximum value and returns a validator that check if the value is less than the given maximum value

```js
import { isLt } from 'checkoid';
const isLessThanFive = isLt(5);
isLessThanFive.check(1); // undefined
isLessThanFive.check(6); // [{ message: 'value must be less than 5', value: 6 }]
```

#### isLte
Take a maximum value and returns a validator that check if the value is less or equal to the given maximum value

```js
import { isLte } from 'checkoid';
const isLessThanFive = isLte(5);
isLessThanFive.check(1); // undefined
isLessThanFive.check(6); // [{ message: 'value must be at most 5', value: 6 }]
```

#### match
Take a regex and returns a validator that check if the value match it

```js
import { match } from 'checkoid';
const isEMail = match(/@/);

isEmail.check('test@gmail.com'); // undefined
isEmail.check('whatever');
// [{ message: 'value must match pattern /@/', value: 'whatever' }]
```

#### hasLengthOf
Take a number and returns a validator that check that the value as a length of the given number.

```js
import { hasLengthOf } from 'checkoid';
const hasLengthOfThree = hasLengthOf(3);
hasLengthOfThree.check([1, 2, 3]); // undefined
hasLengthOfThree.check([]); // [{ message: 'value must have a length of 3', value: [] }]
```

#### hasLengthGt
Take a number and returns a validator who check that the value as a length greater than the given number.

```js
import { hasLengthGt } from 'checkoid';
const isLongerThanThree = hasLengthGt(3);
isLongerThanThree.check([1, 2, 3, 4]); // undefined
isLongerThanThree.check([1, 2, 3]); // [{ message: 'value must have a length greater than 3', value: [1, 2, 3] }]
```

#### hasLengthGte
Take a number and returns a validator who check that the value as a length greater or equal to the given number.

```js
import { hasLengthGte } from 'checkoid';
const hasLengthGteThree = hasLengthGte(3);
hasLengthGteThree.check([1, 2, 3, 4]); // undefined
hasLengthGteThree.check([1, 2, 3]); // undefined
hasLengthGteThree.check([1, 2]); // [{ message: 'value must have a length of at least 3', value: [1, 2] }]
```
#### hasLengthLt
Take a number and returns a validator who check that the value as a length smaller than the given number.

```js
import { hasLengthLt } from 'checkoid';
const isShorterThanThree = hasLengthLt(3);
isShorterThanThree.check([1, 2]); // undefined
isShorterThanThree.check([1, 2, 3, 4]); // [{ message: 'value must have a length less than 3', value: [1, 2, 3, 4] }]
```

#### hasLengthLte
Take a number and returns a validator who check that the value as a length smaller or equal to the given number.

```js
import { hasLengthLte } from 'checkoid';
const hasLengthLteThree = hasLengthLte(3);
hasLengthLteThree.check([1, 2]); // undefined
hasLengthLteThree.check([1, 2, 3]); // undefined
hasLengthLteThree.check([1, 2, 3, 4]); // [{ message: 'value must have a length of at most 3', value: [1, 2, 3, 4] }]
```

#### arrayOf
Take a validator and returns a new validator that apply it to every value in a given array.

```js
import { arrayOf } from 'checkoid';
const isArrayOfNumber = arrayOf(isNumber);
isArrayOfNumber.check([1, 2, 3]); // undefined
isArrayOfNumber.check([1, "deux", 3]); 
// [
//     {
//         key: [1],
//         message: "value must be a number",
//         value: "deux",
//     },
// ]
isArrayOfNumber.check(null);
// [
//     {
//         message: "value must be an array",
//         value: null,
//     },
// ]
```


#### shape
Takes a spec object (an object with key / validator pair) and returns a validator that apply each validators to the corresponding object property.
It also check that the passed value is an object

```js
import { shame, match, hasLengthGt } from 'checkoid';
const isEmail = match(/@/);

const validateUser = shape({
    email: isEmail,
    password: hasLengthGt(8),
});

validateUser.check({ email: 'john@gmail.com', password: 'shouldnotdisplaythis' }) // undefined
validateUser.check({ email: 'john@gmail.com', password: 'secret' })
// [{ key: ['password'], message: 'value must have a length greater than 8', value: 'secret' }]
validateUser.check('Hi I am John a valid user')
// [{ message: 'value must be an object', value: 'Hi I am John a valid user' }]
```

shape also takes an exact boolean as second argument. When set to true, shape will also ensure that there is no key that is not tested by a validator.


```js
import { shape } from 'checkoid';
const validateUser = shape({
    email: isEmail,
    password: hasLengthGt(8),
}, true);

validateUser.check({ email: 'john@gmail.com', password: 'shouldnotdisplaythis' }) // undefined
validateUser.check({ email: 'john@gmail.com', password: 'shouldnotdisplaythis', foo: 'bar', bar: 'baz' })
// [{
//     message: "Value has extraneous keys: foo, baz",
//     value: {
//         email: 'john@gmail.com'
//         password: 'shouldnotdisplaythis'
//         foo: 'bar',
//         bar: 'baz',
//     },
// }]
```

## Installation

```bash
make install
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

```bash
make test
```

To learn more about the contributions to this project, consult the [contribution guide](/.github/CONTRIBUTING.md).

## Maintainer

[![ThieryMichel](https://avatars3.githubusercontent.com/u/4034399?s=96&amp;v=4)](https://github.com/ThieryMichel)     
[ThieryMichel](https://github.com/ThieryMichel) 

## License

Checkoid is licensed under the [MIT License](LICENSE), courtesy of [Marmelab](http://marmelab.com).
