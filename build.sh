
set -ex

# wasm-bindgen

cargo build --manifest-path wasm-bindgen/Cargo.toml \
  --target wasm32-unknown-unknown \
  --release

rm -rf docs
mkdir -p docs
wasm-bindgen target/wasm32-unknown-unknown/release/wasm_bindgen.wasm \
  --out-dir docs \
  --no-modules

# raw wasm
wat2wasm ./raw-wasm/raw.wast -o docs/raw.wasm

# stdweb
(cd stdweb && cargo web build --target=wasm32-unknown-unknown --release)
cp target/wasm32-unknown-unknown/release/bm_stdweb.js docs/
cp target/wasm32-unknown-unknown/release/bm_stdweb.wasm docs/

ln index.html docs/index.html
