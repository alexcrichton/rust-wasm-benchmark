window.jsBenchmarks = {
  fibonacci: (n) => {
    let a = 1;
    let b = 1;
    let tmp = 0;

    while (n > 1) {
      tmp = b;
      b += a;
      a = tmp;
      --n;
    }

    return a;
  },

  thunk: function() {},

  call_js_thunk_n_times: n => {
    const f = window.thunk;
    for (var i = 0; i < n; i++) {
      f();
    }
  },

  add: (a, b) => a + b,

  call_js_add_n_times: (n, a, b) => {
    const f = window.add;
    for (var i = 0; i < n; i++) {
      f(a, b);
    }
  },
};
