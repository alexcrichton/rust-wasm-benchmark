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

  call_node_first_child_n_times: (n, a) => {
    for (let i = 0; i < n; i++) {
      if (a.firstChild === null)
        throw new Error("bad");
    }
  },

  call_node_node_type_n_times: (n, a) => {
    for (let i = 0; i < n; i++) {
      if (a.nodeType === 100)
        throw new Error("bad");
    }
  },

  call_node_has_child_nodes_n_times: (n, a) => {
    for (let i = 0; i < n; i++) {
      if (!a.hasChildNodes())
        throw new Error("bad");
    }
  },

  count_node_types: e => {
    const types = [];

    function count(node, types) {
      while(node) {
        const type = node.nodeType;
        while (types.length <= type)
          types.push(0);
        types[type] += 1;
        count(node.firstChild, types);
        node = node.nextSibling;
      }
    }

    count(e, types);
    return types;
  }
};
