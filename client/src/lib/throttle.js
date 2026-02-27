export const throttle = (fn, wait = 200) => {
  let inThrottle = false;
  let trailingArgs = null;

  const invoke = (context, args) => {
    fn.apply(context, args);
    inThrottle = true;
    setTimeout(() => {
      inThrottle = false;
      if (trailingArgs) {
        const nextArgs = trailingArgs;
        trailingArgs = null;
        invoke(context, nextArgs);
      }
    }, wait);
  };

  return function throttled(...args) {
    if (!inThrottle) {
      invoke(this, args);
      return;
    }
    trailingArgs = args;
  };
};

