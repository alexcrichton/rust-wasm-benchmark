const suites = {};

// wasm-bindgen tests
wasm_bindgen('./wasm_bindgen_bg.wasm').then(() => {
  suites.wasm_bindgen = wasm_bindgen;
});

// raw tests
fetch('./raw.wasm')
  .then(r => r.arrayBuffer())
  .then(r => WebAssembly.instantiate(r, { env: { thunk, add } }))
  .then(r => {
    suites.raw = r.instance.exports;
  });

// stdweb
Rust.bm_stdweb.then(r => {
  suites.stdweb = r;
});

// js
suites.js = jsBenchmarks;

window.onload = function() {
  for (const test of document.querySelectorAll('.test')) {
    const link = test.querySelector('.run');
    link.onclick = function() {
      runtest(test.id);
      link.parentNode.removeChild(link);
      return false;
    };
  }
};

function runtest(id) {
  const canvas = document.createElement('canvas');
  const container = document.getElementById(id);
  container.appendChild(canvas);

  const datasets = [];
  var myLineChart = new Chart(canvas, {
    type: 'line',
    data: {
      //labels: Object.keys(suites),
      datasets,
    },
    options: {
      scales: {
	yAxes: [{
	  ticks: {
	    beginAtZero:true
	  }
	}]
      }
    }
  });

}

function run(name, f) {
  const cheap = [1000000, 10000000/*, 100000000*/];
  if (f.thunk) {
    const g = f.thunk;
    for (const n of cheap) {
      update(name, `JS->Wasm Thunk (${n})`, `js-wasm-thunk-${n}`, () => {
        const now = performance.now();
        for (let i = 0; i < n; i++)
          g();
        return performance.now() - now;
      });
    }
  }

  if (f.call_js_thunk_n_times) {
    const g = f.call_js_thunk_n_times;
    for (const n of cheap) {
      update(name, `Wasm->JS Thunk (${n})`, `wasm-js-thunk-${n}`, () => {
        const now = performance.now();
        g(n);
        return performance.now() - now;
      });
    }
  }

  if (f.add) {
    const g = f.add;
    for (const n of cheap) {
      update(name, `JS->Wasm Add (${n})`, `js-wasm-add-${n}`, () => {
        const now = performance.now();
        for (let i = 0; i < n; i++)
          g();
        return performance.now() - now;
      });
    }
  }

  if (f.call_js_add_n_times) {
    const g = f.call_js_add_n_times;
    for (const n of cheap) {
      update(name, `Wasm->JS Add (${n})`, `wasm-js-add-${n}`, () => {
        const now = performance.now();
        g(n, 1, 2);
        return performance.now() - now;
      });
    }
  }

  if (f.fibonacci) {
    const g = f.fibonacci;
    for (const n of [100000000]) {
      update(name, `Fibonacci(40) (${n})`, `fib-${n}`, () => {
        const now = performance.now();
        g(80);
        return performance.now() - now;
      });
    }
  }
}

function update(name, title, id, f) {
  let row = document.getElementById(id);
  if (row === null) {
    const table = document.getElementById('table');
    const node = document.createElement('tr');
    node.id = id;
    node.innerHTML = `
      <td>${title}</td>
      <td class='raw'></td>
      <td class='wasm-bindgen'></td>
      <td class='stdweb'></td>
      <td class='js'></td>
      `;
    document.getElementById('table').appendChild(node);
    row = node;
  }
  const element = row.querySelector(`.${name}`);
  const y = [title, name];
  element.innerText = 'running ...';
  element.wut = y;
  setTimeout(() => {
    let val;
    try {
      val = `${Math.round(f())}ms`;
    } catch(e) {
      val = 'N/A (failed)';
    }
    element.innerText = val;
  }, 1);
}
