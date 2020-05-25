const Task = (fork) => ({
    map: (f) => Task((reject, resolve) => fork(reject, (a) => resolve(f(a)))),
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

Task.fromAsync = (asyncFn) =>
    Task((reject, resolve) => {
        Promise.resolve(asyncFn()).then(resolve).catch(reject);
    });

module.exports = Task;
