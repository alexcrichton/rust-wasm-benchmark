const suites = [];
const colors = ['blue', 'green', 'red', 'orange']
const NSUITES = 3;
let suites_left = NSUITES;

const labels = [];
const datasets = [];
let chart = null;
let update = null;

function suite(name, functions) {
  const bms = {};

  const process = (name, factory) => {
    if (typeof functions[name] === 'function')
      bms[name] = factory(functions[name]);
  };

  const run_a_bunch = f => {
    return n => {
      for (let i = 0; i < n; i++)
        f();
    }
  };

  process('thunk', run_a_bunch);
  process('add', run_a_bunch);
  process('call_js_thunk_n_times', f => f);
  process('call_js_add_n_times', f => n => f(n, 1, 2));
  process('fibonacci', f => {
    return n => {
      for (let i = 0; i < n; i++) {
        f(40);
      }
    }
  });

  suites.push([name, bms]);
  suites_left--;
  if (suites_left === 0)
    load_chart();
}

// js, baseline
suite('js', jsBenchmarks);

// wasm-bindgen tests
wasm_bindgen('./wasm_bindgen_bg.wasm').then(() => {
  suite('wasm_bindgen', wasm_bindgen);
});

// raw tests
fetch('./raw.wasm')
  .then(r => r.arrayBuffer())
  .then(r => WebAssembly.instantiate(r, { env: { thunk, add } }))
  .then(r => {
    suite('raw', r.instance.exports);
  });

// stdweb, currently very slow on these benchmarks and skews the apparent
// results
// Rust.bm_stdweb.then(r => {
//   suites.push(['stdweb', r]);
// });

function load_chart() {
  const canvas = document.getElementById('canvas');
  for (let i = 0; i < NSUITES; i++) {
    const dataset = {
      label: suites[i][0],
      backgroundColor: colors[i],
    };
    datasets.push(dataset);
  }
  chart = new Chart(canvas, {
    type: 'bar',
    data: { labels, datasets },
    options: {
      animation: { duration: 0 },
      hover: { animationDuration: 0 },
      responsiveAnimationDuration: 0,
      tooltips: {
        // intersect: false,
        mode: 'nearest',
        callbacks: {
          label: function(item, data) {
            if (item.datasetIndex == 0) {
              return 'baseline';
            }
            console.log(item, data);
            const val = data.datasets[item.datasetIndex].data[item.index];
            console.log(val);
            return `${Math.round(val * 100) / 100}% of JS`;
          }
        }
      },
      scales: {
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'percentage speedup/slowdown relative to JS (lower is better)'
          },
        }],
      },
    }
  });
  update = new Update(chart);
  for (const test of document.querySelectorAll('.test')) {
    const link = test.querySelector('.run');
    link.onclick = function() {
      run(test.id)
        .catch(console.error);
      link.parentNode.removeChild(link);
      return false;
    };
    link.style.display = 'inline-block';
  }
}

async function run(id) {
  labels.push(`test: ${id}`);

  const iters = await selectIters(id);
  await waitForATinyBit();
  const data = await measure(id, iters, []);

  for (let i = 0; i < NSUITES; i++) {
    datasets[i].data.push((data[i] / data[0]) * 100);
  }

  update.update();
}

async function selectIters(id) {
  let iters = 4;
  for (; true; iters *= 2) {
    const data = await measure(id, iters, []);
    for (let i = 0; i < NSUITES; i++)
      if (data[i] && data[i] > 5)
        return iters * 50;
    await waitForATinyBit();
  }
}

async function remeasure(id, chart, event) {
  await waitForATinyBit();
  const pow = chart.pows[event._index];
  const update = new Update(chart);
  measure(update, id, Math.floor(Math.pow(2, pow)), chart.data.datasets, event._index);
  update.update();
}

function waitForATinyBit() {
  return new Promise((resolve, reject) => setTimeout(resolve, 1));
}

async function measure(id, iters, prev) {
  let ran = false;

  const data = [];
  for (let i = 0; i < suites.length; i++) {
    const val = await measureOne(id, i, iters, prev);
    data.push(val);
    ran = ran || val !== null;
  }
  if (!ran)
    throw new Error('invalid dataset');
  return data;
}

async function measureOne(id, i, iters, prev) {
  const bm = suites[i][1][id];
  if (bm === undefined)
    return null;

  let min = prev[i] || 0;
  for (let j = 0; j < 4; j++) {
    const dur = measureOneIter(bm, iters);
    await waitForATinyBit();
    if (dur < min || min == 0)
      min = dur;
  }
  return min;
}

function measureOneIter(bm, iters) {
  const now = performance.now();
  bm(iters);
  return performance.now() - now;
}
class Update {
  constructor(chart) {
    this.chart = chart;
    this.tick = performance.now();
  }

  update() {
    this.chart.update();
    this.tick = performance.now();
  }

  maybeUpdate() {
    if (performance.now() - this.tick >= 100)
      this.update();
  }
}
