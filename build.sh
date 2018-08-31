
set -ex

# wasm-bindgen

cargo build --manifest-path wasm-bindgen/Cargo.toml \
  --target wasm32-unknown-unknown \
  --release

rm -rf dist
mkdir -p dist
wasm-bindgen target/wasm32-unknown-unknown/release/wasm_bindgen.wasm \
  --out-dir dist \
  --no-modules

# raw wasm
wat2wasm ./raw-wasm/raw.wast -o dist/raw.wasm

# stdweb
(cd stdweb && cargo web build --target=wasm32-unknown-unknown --release)
cp target/wasm32-unknown-unknown/release/bm_stdweb.js dist/
cp target/wasm32-unknown-unknown/release/bm_stdweb.wasm dist/

ln -nsf ../index.html dist/index.html
