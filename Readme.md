![Tests on Github](https://github.com/marmelab/checkoid/workflows/test/badge.svg) ![Travis (.com)](https://img.shields.io/travis/com/marmelab/checkoid.svg) ![GitHub top language](https://img.shields.io/github/languages/top/marmelab/checkoid.svg) ![GitHub contributors](https://img.shields.io/github/contributors/marmelab/checkoid.svg) ![checkoid.svg](https://img.shields.io/github/license/marmelab/checkoid.svg) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

Checkoid is an experimental validator library using Monoid under the hood to allow to combine validator like you would lego piece.

## Usage
You can create simple validator:
Simply pass a function, that either return a value for an error, or nothing if the value is valid.

```js
const { validator } = require('checkoid');

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

Additionally you can use checkoid own validator for boolean, string, number, list 

You can validate object too

```js
const { shape } = require('checkoid');

const isGreaterThan = length => validator(value => {
    if (value && value.length <= length) {
        return `value must be at least ${length} characters long`;
    }
})

// objectValidator takes an object of other validator and return a validator
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
const { arrayOf } = require('checkoid');

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

In short all validator can be combined together, and you will always get back a Validator.

It is also possible to create asyncValidator

```js
const { asyncValidator } = require('checkoid');

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

asyncValidators can be combined exactly like syncValidator, they can even be combined with syncValidator. 
Simply as soon an asyncValidator get combined with other syncValidator, the resultant validator will automatically become async.

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

Function to create a validator holding an async function. It takes a simple validation async function that take a value and returns a promise holding either undefined when the value is valid or an invalid message when the value is not.


```js
const { asyncValidator } = require('checkoid');

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
The validator object possess the following methods

#### check
Take a value and either returns undefined if it pass the validation or an array of object describing the issues otherwise.
The array contains an object for each validation function that returned an issue.

If the validator is async, the result will get wrapped inside a promise

It possess the following preoperty :

- message: The message returned by the validation function
- value: The value that has been tested. In the case of a shape or arrayOf validator this will be the targeted value and not thewhole object or array.
- key: Optional, the key of the value being tested if applyable

#### and
Take another validator and return a new validator that apply the validations of both validator. All error will get combined

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
Take another validator and return a new validator that apply the validations of both validator. But will only return the errors from the second, if the first return no error. Like a logical or.


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
Allowing to customize it.
This function returns a new validator

```js
const isEmail = match(/@/).format(({ message, value }) => `value: "${value}" is not a valid email`);


isEmail.check('test@gmail.com'); // undefined
isEmail.check('whatever');
// [{ message: 'value: "whatever" is not a valid email', value: 'whatever' }]
```

#### beforeHook
Takes a function that will be applyed to the tested value before the validation function. This allows to sanitize the value for example.
This function returns a new validator.

```js
const isLongerThan8 = isLengthGt(8).beforeHook(value => value.trim());

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
Checkoid provides the following basic validator to check basic type.

isNumber
isString
isBoolean
isObject
isArray
isTrue
isFalse


### validator factory
Checkoid provides the following validator factory function that returns validator

#### isGt
Take a minimum value and return a validator that check if value is greater than given the given minimum value

```js
const isGreaterThanFive = isGt(5);
isGreaterThanFive.check(6); // undefined
isGreaterThanFive.check(1); // [{ message: 'value must be greater than 5', value: 1 }]
```

#### isGte
Take a minimum value and return a validator that check if value is greater or equal than given the given minimum value

```js
const isAtLeastFive = isGte(5);
isAtLeastFive.check(6); // undefined
isAtLeastFive.check(1); // [{ message: 'value must be at least 5', value: 1 }]
```

#### isLt
Take a maximum value and return a validator that check if value is less than given the given maximum value

```js
const isLessThanFive = isLt(5);
isLessThanFive.check(1); // undefined
isLessThanFive.check(6); // [{ message: 'value must be less than 5', value: 6 }]
```

#### isLte
Take a maximum value and return a validator that check if value is less or equal to given the given maximum value

```js
const isLessThanFive = isLte(5);
isLessThanFive.check(1); // undefined
isLessThanFive.check(6); // [{ message: 'value must be at most 5', value: 6 }]
```

#### match
Take a regex and return a validator that check if checked value match it

```js
const isEMail = match(/@/);

isEmail.check('test@gmail.com'); // undefined
isEmail.check('whatever');
// [{ message: 'value must match pattern /@/', value: 'whatever' }]
```

#### hasLengthOf
Take a number and return a validator that check its value as a length of the given number.

```js
const hasLengthOfThree = hasLengthOf(3);
hasLengthOfThree.check([1, 2, 3]); // undefined
hasLengthOfThree.check([]); // [{ message: 'value must have a length of 3', value: [] }]
```

#### hasLengthGt
Take a number and return a validator that check its value as a length greater than the given number.

```js
const isLongerThanThree = hasLengthGt(3);
isLongerThanThree.check([1, 2, 3, 4]); // undefined
isLongerThanThree.check([1, 2, 3]); // [{ message: 'value must have a length greater than 3', value: [1, 2, 3] }]
```

#### hasLengthGte
Take a number and return a validator that check its value as a length greater or equal to the given number.

```js
const hasLengthGteThree = hasLengthGte(3);
hasLengthGteThree.check([1, 2, 3, 4]); // undefined
hasLengthGteThree.check([1, 2, 3]); // undefined
hasLengthGteThree.check([1, 2]); // [{ message: 'value must have a length of at least 3', value: [1, 2] }]
```
#### hasLengthLt
Take a number and return a validator that check its value as a length smaller than the given number.

```js
const isShorterThanThree = hasLengthLt(3);
isShorterThanThree.check([1, 2]); // undefined
isShorterThanThree.check([1, 2, 3, 4]); // [{ message: 'value must have a length less than 3', value: [1, 2, 3, 4] }]
```

#### hasLengthLte
Take a number and return a validator that check its value as a length smaller or equal to the given number.

```js
const hasLengthLteThree = hasLengthLte(3);
hasLengthLteThree.check([1, 2]); // undefined
hasLengthLteThree.check([1, 2, 3]); // undefined
hasLengthLteThree.check([1, 2, 3, 4]); // [{ message: 'value must have a length of at most 3', value: [1, 2, 3, 4] }]
```

#### arrayOf
Take a validator and return a new validator that apply it to every value in a given array.

```js
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
Take a spec object (an object with key / validator pair) and return a validator that apply each validator to the 
It also check that the passed value is an object

```js
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

shape take also a exact boolean as second argument. whe set to true, shape will also ensure that there is no extraneous key.


```js
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
