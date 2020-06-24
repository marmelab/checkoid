// Valid will keep it's original value
const Valid = (x) => ({
    x,
    isValid: true,
    and: (other) => {
        if (other.fork) {
            return Async.of(Valid(x)).and(other);
        }

        return other.isValid ? Valid(x) : other;
    },
    or: (other) => {
        // If other is Async convert Valid to Async(Valid)
        if (other.fork) {
            return Async.of(Valid(x));
        }
        return Valid(x);
    }, // no matter the other we keep the valid value
    format: (fn) => Valid(x),
    fold: (onValid, onInvalid) => onValid(x),
    getResult: () => x,
});

exports.Valid = Valid;

// Invalid will concat other invalid value to its value
const Invalid = (x) => ({
    x,
    isValid: false,
    and: (other) => {
        if (other.fork) {
            return Async.of(Invalid(x)).and(other);
        }

        return other.isValid ? Invalid(x) : Invalid(x.concat(other.x));
    },
    or: (other) => {
        if (other.fork) {
            return Async.of(Invalid(x)).or(other);
        }
        return other.isValid ? Valid(other.x) : Invalid(x.concat(other.x));
    },
    format: (fn) => Invalid(x.map(fn)), // allows to apply function to invalid message
    fold: (onValid, onInvalid) => onInvalid(x),
    getResult: () => x,
});

// Async validation that will resolve to a Valid or Invalid one
const Async = (fork) => ({
    and: (other) =>
        Async((reject, resolve) =>
            fork(reject, (result1) => {
                (other.fork ? other : Async.of(other)).fork(reject, (result2) =>
                    resolve(result1.and(result2))
                );
            })
        ),
    or: (other) =>
        Async((reject, resolve) =>
            fork(reject, (result1) => {
                (other.fork ? other : Async.of(other)).fork(reject, (result2) =>
                    resolve(result1.or(result2))
                );
            })
        ),
    format: (fn) =>
        Async((reject, resolve) =>
            fork(reject, (result) => resolve(result.format(fn)))
        ),
    fork,
    toPromise: () => new Promise((resolve, reject) => fork(reject, resolve)),
    getResult: () =>
        new Promise((resolve, reject) =>
            fork(reject, resolve)
        ).then((validation) => validation.getResult()),
});
Async.of = (a) => Async((_, resolve) => resolve(a));
Async.valid = (a) => Async((_, resolve) => resolve(Valid(a)));
Async.invalid = (a) => Async((_, resolve) => resolve(Invalid(a)));

// Takes a function and wrap its result in an Async data type
Async.lift = (fn) => (...args) =>
    Async((reject, resolve) => {
        try {
            // Promise.resolve will convert the function result to a promise if it is not
            Promise.resolve(fn(...args))
                .then(resolve)
                .catch(reject);
        } catch (error) {
            // catch eventual synchronous error
            reject(error);
        }
    });

module.exports = { Valid, Invalid, Async };
