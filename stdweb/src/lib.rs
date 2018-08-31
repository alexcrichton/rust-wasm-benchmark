#[macro_use]
extern crate stdweb;

use stdweb::js_export;

#[js_export]
fn call_js_thunk_n_times(n: usize) {
    for _ in 0..n {
        js! { thunk(); }
    }
}

#[js_export]
fn call_js_add_n_times(n: usize, a: i32, b: i32) {
    for _ in 0..n {
        js! { add(@{a}, @{b}) };
    }
}

#[js_export]
fn thunk() {}

#[js_export]
fn add(a: i32, b: i32) -> i32 { a + b }
