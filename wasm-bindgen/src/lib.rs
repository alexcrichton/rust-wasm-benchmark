extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern {
    #[wasm_bindgen(js_name = thunk)]
    fn js_thunk();
    #[wasm_bindgen(js_name = add)]
    fn js_add(a: i32, b: i32) -> i32;

    pub type Foo;
    #[wasm_bindgen(method)]
    fn bar(this: &Foo);
    #[wasm_bindgen(method, structural, js_name = bar)]
    fn bar_structural(this: &Foo);

    fn doesnt_throw();
    #[wasm_bindgen(catch, js_name = doesnt_throw)]
    fn doesnt_throw_catch() -> Result<(), JsValue>;
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

static mut FIB_HIGH: i32 = 0;

#[wasm_bindgen]
pub fn fibonacci(n: i32) -> i32 {
    let mut a = 1u64;
    let mut b = 1;
    for _ in 0..n {
        let tmp = b;
        b += a;
        a = tmp;
    }
    unsafe { FIB_HIGH = (a >> 32) as i32; }
    return a as i32
}

#[wasm_bindgen]
pub fn fibonacci_high() -> i32 {
    unsafe { FIB_HIGH }
}

#[wasm_bindgen]
pub fn call_foo_bar_n_times(n: usize, foo: &Foo) {
    for _ in 0..n {
        foo.bar();
    }
}

#[wasm_bindgen]
pub fn call_foo_bar_structural_n_times(n: usize, foo: &Foo) {
    for _ in 0..n {
        foo.bar_structural();
    }
}

#[wasm_bindgen]
pub fn call_doesnt_throw_n_times(n: usize) {
    for _ in 0..n {
        doesnt_throw();
    }
}

#[wasm_bindgen]
pub fn call_doesnt_throw_with_catch_n_times(n: usize) {
    for _ in 0..n {
        if let Err(e) = doesnt_throw_catch() {
            wasm_bindgen::throw_val(e);
        }
    }
}
