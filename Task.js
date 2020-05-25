const Task = (fork) => ({
    and: (other) =>
        Task((reject, resolve) =>
            fork(reject, (result1) => {
                other.fork(reject, (result2) => resolve(result1.and(result2)));
            })
        ),
    or: (other) =>
        Task((reject, resolve) =>
            fork(reject, (result1) => {
                other.fork(reject, (result2) => resolve(result1.or(result2)));
            })
        ),
    fork,
    toPromise: () => new Promise((resolve, reject) => fork(reject, resolve)),
});
Task.of = (a) => Task((_, resolve) => resolve(a));

Task.fromFn = (fn) =>
    Task((reject, resolve) => {
        try {
            // Promise.resolve will convert the result to a promise if it is not
            Promise.resolve(fn()).then(resolve).catch(reject);
        } catch (error) {
            // catch eventual synchronous error
            reject(error);
        }
    });

module.exports = Task;
