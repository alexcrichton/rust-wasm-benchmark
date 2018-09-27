const suites = [];
const colors = ['blue', 'green', 'red', 'orange']
const charts = {};

// wasm-bindgen tests
wasm_bindgen('./wasm_bindgen_bg.wasm').then(() => {
  suites.push(['wasm_bindgen', wasm_bindgen]);
});

// raw tests
fetch('./raw.wasm')
  .then(r => r.arrayBuffer())
  .then(r => WebAssembly.instantiate(r, { env: { thunk, add } }))
  .then(r => {
    suites.push(['raw', r.instance.exports]);
  });

// stdweb, currently very slow on these benchmarks and skews the apparent
// results
// Rust.bm_stdweb.then(r => {
//   suites.push(['stdweb', r]);
// });

// js
suites.push(['js', jsBenchmarks]);

window.onload = function() {
  for (const test of document.querySelectorAll('.test')) {
    const link = test.querySelector('.run');
    link.onclick = function() {
      runtest(test.id);
      link.parentNode.removeChild(link);
      return false;
    };

    test.querySelector('.more').onclick = function() {
      moretest(test.id);
      return false;
    };
  }
};

async function runtest(id) {
  const canvas = document.createElement('canvas');
  const container = document.getElementById(id);
  container.appendChild(canvas);

  const labels = [];
  const datasets = [];
  for (let i = 0; i < suites.length; i++) {
    const dataset = {
      label: suites[i][0],
      borderColor: colors[i],
      fill: false,
    };
    datasets.push(dataset);
  }
  var myLineChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets,
    },
    options: {
      animation: {
	duration: 0, // general animation time
      },
      hover: {
	animationDuration: 0, // duration of animations when hovering an item
      },
      responsiveAnimationDuration: 0, // animation duration after a resize
      // scales: {
      //   yAxes: [{
      //     scaleLabel: {
      //       labelString: 'time (ms)'
      //     },
      //   }]
      // }
    }
  });

  await run(myLineChart, id, labels, datasets);

  document.querySelector(`#${id} .more`).style.display = 'inline-block';
  charts[id] = myLineChart;

  canvas.onclick = function(e) {
    for (const element of myLineChart.getElementAtEvent(e))
      remeasure(id, myLineChart, element);
    return false;
  };
}

async function run(chart, id, labels, datasets) {
  let remaining = 6;
  let cur = 0;
  chart.pows = [];
  const update = new Update(chart);

  for (let pow = 4; remaining > 0; pow++) {
    labels.push(`2^${pow}`);
    for (let i = 0; i < suites.length; i++)
      datasets[i].data.push(0);
    chart.pows.push(pow);
    if (!measure(update, id, 1 << pow, datasets, cur)) {
      labels.pop();
      for (let i = 0; i < suites.length; i++)
        datasets[i].data.pop();
      chart.pows.pop(pow);
      continue;
    }
    remaining -= 1;
    cur += 1;
    update.update();
    await waitForATinyBit();
  }
}

async function moretest(id) {
  const chart = charts[id];
  const update = new Update(chart);

  for (let i = chart.pows.length - 2; i >= 0; i--) {
    const left = chart.pows[i];
    const right = chart.pows[i + 1];
    const mid = (left + right) / 2;
    const iters = Math.pow(2, mid);

    chart.data.labels.push(0);
    for (let k = 0; k < chart.data.datasets.length; k++) {
      chart.data.datasets[k].data.push(0);
    }
    for (let j = chart.data.labels.length - 1; j > i; j--) {
      chart.data.labels[j] = chart.data.labels[j - 1];
      chart.pows[j] = chart.pows[j - 1];
      for (let k = 0; k < chart.data.datasets.length; k++) {
        chart.data.datasets[k].data[j] =
          chart.data.datasets[k].data[j - 1];
      }
    }
    chart.data.labels[i + 1] = `2^${mid}`;
    chart.pows[i + 1] = mid;
    for (let k = 0; k < chart.data.datasets.length; k++)
      chart.data.datasets[k].data[i + 1] = 0;
    measure(update, id, Math.round(Math.pow(2, mid)), chart.data.datasets, i + 1);

    update.maybeUpdate();
    await waitForATinyBit();
  }
  update.update();
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

function measure(update, id, iters, datasets, idx) {
  let valid = false;
  let ran = false;

  for (let i = 0; i < suites.length; i++) {
    const f = suites[i][1][id];
    if (f === undefined)
      continue;
    let bm = null;
    switch(id) {
      case 'thunk':
      case 'add':
        bm = n => {
          for (let i = 0; i < n; i++) {
            f();
          }
        };
        break;
      case 'call_js_thunk_n_times':
        bm = f;
        break;
      case 'call_js_add_n_times':
        bm = n => f(n, 1, 2);
        break;
      case 'fibonacci':
        bm = n => {
          for (let i = 0; i < n; i++) {
            f(40);
          }
        };
        break;
      default:
        throw new Error(`unknown benchmark id ${id}`)
    }
    ran = true;

    let min = datasets[i].data[idx];
    for (let j = 0; j < 4; j++) {
      const now = performance.now();
      bm(iters);
      const dur = performance.now() - now;
      if (dur < min || min == 0) {
        min = dur;
        datasets[i].data[idx] = min;
        update.maybeUpdate();
      }
      if (min > 100)
        break;
    }
    if (min > 5)
      valid = true;
  }

  if (!ran)
    throw new Error('invalid dataset');
  return valid;
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
