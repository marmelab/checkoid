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

await isEmail.check('test@gmail.com'); // undefined
await isNotGmail.check('test@gmail.com'); // ['value must not be a gmail adress']
await isEmail.check('whatever'); // ['value must be an email']
await isNotGmail.check('whatever'); // ['value must not be a gmail adress']
```

And then combine them with `and`

```js
const isEmailNotFromGMail = isEMail.and(isNotGmail);
await isEmailNotFromGMail.check('whatever'); // ['value must be an email', 'value must not be a gmail adress']
await isEmailNotFromGMail.check('test@gmail.com'); // ['value must not be a gmail adress']
await isEmailNotFromGMail.check('test@free.ff'); // undefined
```

Or with or

```js
const isOptional = validator((value) => {
    if (!!value) {
        return Validation.Invalid([`value is optional`]);
    }
    return Validation.Valid(value);
});

const isOptionalEmail = isEmail.or(isOptional);

await isOptionalEmail.check(''); // undefined
await isOptionalEmail.check('test@gmail.com'); // undefined
await isOptionalEmail.check('invalid mail'); // ['value must be an email', 'value is optional']
```

You can validate object too

```js
const { objectValidator } = require('checkoid');

const isGreaterThan = length => validator(value => {
    if (value && value.length <= length) {
        return Validation.Invalid([`value must be at least ${length} characters long`]);
    }

    return Validation.valid();
})

// objectValidator takes an object of other validator and return a validator
const validateUser = objectValidator({
    email: isEmail.or(isAbsent),
    password: isGreaterThan(8),
});

await validateUser.check({ email: 'john@gmail.com', password: 'shouldnotdisplaythis' }) // undefined
await validateUser.check({ email: 'john@gmail.com', password: 'secret' })
// [{ key: 'password', message: 'value must be at least 8 characters long' }]
await validateUser.check('Hi I am John a valid user')
// [{ message: 'value must be an object', value: 'Hi I am John a valid user' }]
```

Or array

```js
const { listValidator } = require('checkoid');

// listValidator take any validator and apply it to a list of value
const isEmailList = listValidator(isEmail);

await isEmailList.check([]); // undefined
await isEmailList.check(['test@test.com', 'john@doe.com']); // undefined
await isEmailList.check(['test@test.com', 'I am a valid email', 'john@doe.com']);
// [{ key: '[1]', message: 'value must be an email', value: 'I am a valid email' }]
await isEmailList.check('I am an email list'); // [{ message: 'value must be an array', value: 'I am an email list' }]
```

Or array of object

```js
const isUserList = listValidator(validateUser);

await isUserList.check([]); // undefined
await isUserList.check([
    { email: 'john@gmail.com', password: 'shouldnotdisplaythis' },
    { email: 'jane@gmail.com', password: 'mySecretPassword' },
]); // undefined
await isUserList.check([
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

To create an async validator symply pass an async function:

```js
const doesUserIdExists = validator(async value => {
    const user = await fetchUser(value);
    if(user) {
        return Validation.Valid();
    }

    return Validation.Invalid(['There is no user with this id']);
});
```

You can pass any function to validator as long as it returns or resolves to Validation object.
