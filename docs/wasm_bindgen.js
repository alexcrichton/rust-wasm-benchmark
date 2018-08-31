
(function() {
    var wasm;
    const __exports = {};
    
    
    __exports.__wbg_thunk_868183c59ed2de1b = function() {
        thunk();
    };
    
    __exports.__wbg_add_57ef8b64543d042a = function(arg0, arg1) {
        return add(arg0, arg1);
    };
    /**
    * @param {number} arg0
    * @returns {void}
    */
    __exports.call_js_thunk_n_times = function(arg0) {
        return wasm.call_js_thunk_n_times(arg0);
    };
    
    /**
    * @param {number} arg0
    * @param {number} arg1
    * @param {number} arg2
    * @returns {void}
    */
    __exports.call_js_add_n_times = function(arg0, arg1, arg2) {
        return wasm.call_js_add_n_times(arg0, arg1, arg2);
    };
    
    /**
    * @returns {void}
    */
    __exports.thunk = function() {
        return wasm.thunk();
    };
    
    /**
    * @param {number} arg0
    * @param {number} arg1
    * @returns {number}
    */
    __exports.add = function(arg0, arg1) {
        return wasm.add(arg0, arg1);
    };
    
    function init(wasm_path) {
        const fetchPromise = fetch(wasm_path);
        let resultPromise;
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            resultPromise = WebAssembly.instantiateStreaming(fetchPromise, { './wasm_bindgen': __exports });
        } else {
            resultPromise = fetchPromise
            .then(response => response.arrayBuffer())
            .then(buffer => WebAssembly.instantiate(buffer, { './wasm_bindgen': __exports }));
        }
        return resultPromise.then(({instance}) => {
            wasm = init.wasm = instance.exports;
            return;
        });
    };
    self.wasm_bindgen = Object.assign(init, __exports);
})();

