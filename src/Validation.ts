// Valid will hold no value
export const Valid = () => ({
    isValid: true,
    and: (other) => {
        if (other.fork) {
            return Async.of(Valid()).and(other);
        }

        return other.isValid ? Valid() : other;
    },
    or: (other) => {
        // If other is Async convert Valid to Async(Valid)
        if (other.fork) {
            return Async.of(Valid());
        }
        return Valid();
    }, // no matter the other we keep the valid value
    format: (fn) => Valid(),
    fold: (onValid, onInvalid) => onValid(),
    getResult: () => undefined,
});

exports.Valid = Valid;

// Invalid will concat other invalid value to its value
export const Invalid = (x) => ({
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
        return other.isValid ? Valid() : Invalid(x.concat(other.x));
    },
    format: (fn) => Invalid(x.map(fn)), // allows to apply function to invalid message
    fold: (onValid, onInvalid) => onInvalid(x),
    getResult: () => x,
});

// Async validation that will resolve to a Valid or Invalid one
export const Async = (fork) => ({
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
Async.valid = () => Async((_, resolve) => resolve(Valid()));
Async.invalid = (a) => Async((_, resolve) => resolve(Invalid(a)));

export const lift = (fn) => (value) => {
    const result = fn(value);
    if (result && result.then) {
        throw new Error(
            "lift only accept synchronous function, use asyncLift instead"
        );
    }

    if (result) {
        return Invalid([result]);
    }

    return Valid();
};

// Takes a function and wrap its result in an Async data type
export const asyncLift = (fn) => (value) =>
    Async((reject, resolve) => {
        try {
            // Promise.resolve will convert the function result to a promise if it is not
            Promise.resolve(fn(value))
                .then((result) => resolve(result ? Invalid([result]) : Valid()))
                .catch(reject);
        } catch (error) {
            // catch eventual synchronous error
            reject(error);
        }
    });

// module.exports = { Valid, Invalid, Async, lift, asyncLift };
