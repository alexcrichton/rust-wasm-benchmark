extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern {
    #[wasm_bindgen(js_name = thunk)]
    fn js_thunk();
    #[wasm_bindgen(js_name = add)]
    fn js_add(a: i32, b: i32) -> i32;
}

#[wasm_bindgen]
pub fn call_js_thunk_n_times(n: usize) {
    for _ in 0..n {
        js_thunk();
    }
}

#[wasm_bindgen]
pub fn call_js_add_n_times(n: usize, a: i32, b: i32) {
    for _ in 0..n {
        js_add(a, b);
    }
}

#[wasm_bindgen]
pub fn thunk() {}

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
