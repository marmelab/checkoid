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
isEmail.check('whatever'); // ['value must be an email']
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
//      { message: ''value is not empty'', value: 'invalid mail' }
// ]
```

You can validate object too

```js
const { objectValidator } = require('checkoid');

const isGreaterThan = length => validator(value => {
    if (value && value.length <= length) {
        return `value must be at least ${length} characters long`;
    }
})

// objectValidator takes an object of other validator and return a validator
const validateUser = objectValidator({
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
const { listValidator } = require('checkoid');

// listValidator take any validator and apply it to a list of value
const isEmailList = listValidator(isEmail);

isEmailList.check([]); // undefined
isEmailList.check(['test@test.com', 'john@doe.com']); // undefined
isEmailList.check(['test@test.com', 'I am a valid email', 'john@doe.com']);
// [{ key: [1], message: 'value must be an email', value: 'I am a valid email' }]
isEmailList.check('I am an email list'); // [{ message: 'value must be an array', value: 'I am an email list' }]
```

Or array of object

```js
const isUserList = listValidator(validateUser);

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
