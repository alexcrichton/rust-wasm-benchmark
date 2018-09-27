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

static mut FIB_HIGH: i32 = 0;

#[js_export]
fn fibonacci(n: i32) -> i32 {
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

#[js_export]
fn fibonacci_high() -> i32 {
    unsafe { FIB_HIGH }
}
