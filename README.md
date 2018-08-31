# Rust Wasm Benchmark

This repo contains some simple benchmarks between handwritten web assembly,
wasm-bindgen, and stdweb compilations. The current benchmarks are primarily
tailored to benchmark the overhead of function calls between JS and wasm.

**This repository is not a general-purpose benchmark between wasm-bindgen and
stdweb**

[Run this benchmark yourelf](https://alexcrichton.github.io/rust-wasm-benchmark/index.html)

Results on Firefox Nightly as of 2018-08-31:

| Test | raw \*.wast | wasm-bindgen | stdweb |
|-----|--------|-----------|-----------|
| JS->Wasm Thunk (1000000) | 8ms | 9ms | 46ms |
| JS->Wasm Thunk (10000000) | 50ms | 77ms | 384ms |
| JS->Wasm Thunk (100000000) | 468ms | 743ms | 2717ms |
| Wasm->JS Thunk (1000000) | 4ms | 6ms | 48ms |
| Wasm->JS Thunk (10000000) | 43ms | 42ms | 418ms |
| Wasm->JS Thunk (100000000) | 370ms | 411ms | 4165ms |
| JS->Wasm Add (1000000) | 5ms | 7ms | 32ms |
| JS->Wasm Add (10000000) | 47ms | 77ms | 284ms |
| JS->Wasm Add (100000000) | 445ms | 875ms | 2762ms |
| Wasm->JS Add (1000000) | 9ms | 15ms | 94ms |
| Wasm->JS Add (10000000) | 61ms | 93ms | 744ms |
| Wasm->JS Add (100000000) | 593ms | 843ms | 6871ms |
