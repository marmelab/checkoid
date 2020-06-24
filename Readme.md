# Checkoid 

Checkoid is an experimental validator library using Monoid under the hood to allow to combine validator like you would lego piece.

## Usage
You can create simple validator:

```js
const { validator, Validation } = require('checkoid');

const isEmail = validator((value) => {
    if (/@/.test(value)) {
        return Validation.Valid();
    }
    return Validation.Invalid(['value must be an email']);
});
const isNotGmail = validator((value) => {
    if (/gmail.com/.test(value)) {
        return Validation.Invalid(['value must not be a gmail adress']);
    }
    return Validation.Valid();
});

isEmail.check('test@gmail.com'); // undefined
isNotGmail.check('test@gmail.com'); // ['value must not be a gmail adress']
isEmail.check('whatever'); // ['value must be an email']
isNotGmail.check('whatever'); // ['value must not be a gmail adress']
```

And then combine them with `and`

```js
const isEmailNotFromGMail = isEMail.and(isNotGmail);
isEmailNotFromGMail.check('whatever'); // ['value must be an email', 'value must not be a gmail adress']
isEmailNotFromGMail.check('test@gmail.com'); // ['value must not be a gmail adress']
isEmailNotFromGMail.check('test@free.ff'); // undefined
```

Or with or

```js
const isEmpty = validator((value) => {
    if (!!value) {
        return Validation.Invalid([`value is not empty`]);
    }
    return Validation.Valid(value);
});

const isOptionalEmail = isEmail.or(isEmpty);

isOptionalEmail.check(''); // undefined
isOptionalEmail.check('test@gmail.com'); // undefined
isOptionalEmail.check('invalid mail'); // ['value must be an email', 'value is not empty']
```

You can validate object too

```js
const { objectValidator } = require('checkoid');

const isGreaterThan = length => validator(value => {
    if (value && value.length <= length) {
        return Validation.Invalid([`value must be at least ${length} characters long`]);
    }

    return Validation.Valid();
})

// objectValidator takes an object of other validator and return a validator
const validateUser = objectValidator({
    email: isEmail.or(isAbsent),
    password: isGreaterThan(8),
});

validateUser.check({ email: 'john@gmail.com', password: 'shouldnotdisplaythis' }) // undefined
validateUser.check({ email: 'john@gmail.com', password: 'secret' })
// [{ key: 'password', message: 'value must be at least 8 characters long' }]
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
// [{ key: '[1]', message: 'value must be an email', value: 'I am a valid email' }]
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
]); // [
//    { key: '[1]', mesage: 'value is not an object', value: 'I am an user' },
//    { key: '[2].password', message: 'value must be at least 8 characters long', value: '1234' },
// ]
```

In short all validator can be combined together, and you will always get back a Validator.

As to why the `check` method returns a promise: it is because Checkoid support async validation too.

It is also possible to create asyncValidator

```js
const { asyncValidator } = require('checkoid');

const doesUserIdExists = asyncValidator(async value => {
    const user = await fetchUser(value);
    if(user) {
        return Validation.Valid();
    }

    return Validation.Invalid(['There is no user with this id']);
});

// with an async validator the check method return a promise
await doesUserIdExists.check('badId'); // ['There is no user with this id']
await doesUserIdExists.check('goodId'); // undefined
```

asyncValidators can be combined exactly like syncValidator, they can even be combined with syncValidator. 
Simply as soon an asyncValidator get combined with other syncValidator, the resultant validator will automatically become async.
