(function() {
    var wasm;
    const __exports = {};


    __exports.__wbg_thunk_868183c59ed2de1b = function() {
        thunk();
    };

    __exports.__wbg_add_57ef8b64543d042a = function(arg0, arg1) {
        return add(arg0, arg1);
    };

    const __wbg_bar_2f9c9bda2be49115_target = Foo.prototype.bar || function() {
        throw new Error(`wasm-bindgen: Foo.prototype.bar does not exist`);
    };

    const stack = [];

    const slab = [{ obj: undefined }, { obj: null }, { obj: true }, { obj: false }];

    function getObject(idx) {
        if ((idx & 1) === 1) {
            return stack[idx >> 1];
        } else {
            const val = slab[idx >> 1];

            return val.obj;

        }
    }

    __exports.__wbg_bar_2f9c9bda2be49115 = function(arg0) {
        __wbg_bar_2f9c9bda2be49115_target.call(getObject(arg0));
    };

    const __wbg_bar_869c64e188e8065e_target = function() {
        return this.bar();
    };

    __exports.__wbg_bar_869c64e188e8065e = function(arg0) {
        __wbg_bar_869c64e188e8065e_target.call(getObject(arg0));
    };

    __exports.__wbg_doesntthrow_71d4a161d757b2ae = function() {
        doesnt_throw();
    };

    let cachegetUint32Memory = null;
    function getUint32Memory() {
        if (cachegetUint32Memory === null || cachegetUint32Memory.buffer !== wasm.memory.buffer) {
            cachegetUint32Memory = new Uint32Array(wasm.memory.buffer);
        }
        return cachegetUint32Memory;
    }

    let slab_next = slab.length;

    function addHeapObject(obj) {
        if (slab_next === slab.length) slab.push(slab.length + 1);
        const idx = slab_next;
        const next = slab[idx];

        slab_next = next;

        slab[idx] = { obj, cnt: 1 };
        return idx << 1;
    }

    __exports.__wbg_doesntthrow_6868e3dfd5cf9e97 = function(exnptr) {
        try {
            doesnt_throw();
        } catch (e) {
            const view = getUint32Memory();
            view[exnptr / 4] = 1;
            view[exnptr / 4 + 1] = addHeapObject(e);

        }
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

    /**
    * @param {number} arg0
    * @returns {number}
    */
    __exports.fibonacci = function(arg0) {
        return wasm.fibonacci(arg0);
    };

    /**
    * @returns {number}
    */
    __exports.fibonacci_high = function() {
        return wasm.fibonacci_high();
    };

    function addBorrowedObject(obj) {
        stack.push(obj);
        return ((stack.length - 1) << 1) | 1;
    }
    /**
    * @param {number} arg0
    * @param {any} arg1
    * @returns {void}
    */
    __exports.call_foo_bar_n_times = function(arg0, arg1) {
        try {
            return wasm.call_foo_bar_n_times(arg0, addBorrowedObject(arg1));

        } finally {
            stack.pop();

        }

    };

    /**
    * @param {number} arg0
    * @param {any} arg1
    * @returns {void}
    */
    __exports.call_foo_bar_structural_n_times = function(arg0, arg1) {
        try {
            return wasm.call_foo_bar_structural_n_times(arg0, addBorrowedObject(arg1));

        } finally {
            stack.pop();

        }

    };

    /**
    * @param {number} arg0
    * @returns {void}
    */
    __exports.call_doesnt_throw_n_times = function(arg0) {
        return wasm.call_doesnt_throw_n_times(arg0);
    };

    /**
    * @param {number} arg0
    * @returns {void}
    */
    __exports.call_doesnt_throw_with_catch_n_times = function(arg0) {
        return wasm.call_doesnt_throw_with_catch_n_times(arg0);
    };

    function GetOwnOrInheritedPropertyDescriptor(obj, id) {
        while (obj) {
            let desc = Object.getOwnPropertyDescriptor(obj, id);
            if (desc) return desc;
            obj = Object.getPrototypeOf(obj);
        }
        throw new Error(`descriptor for id='${id}' not found`);
    }

    const __wbg_firstChild_92c933dd471bfe72_target = GetOwnOrInheritedPropertyDescriptor(Element.prototype, 'firstChild').get || function() {
        throw new Error(`wasm-bindgen: GetOwnOrInheritedPropertyDescriptor(Element.prototype, 'firstChild').get does not exist`);
    };

    function isLikeNone(x) {
        return x === undefined || x === null;
    }

    __exports.__wbg_firstChild_92c933dd471bfe72 = function(arg0) {

        const val = __wbg_firstChild_92c933dd471bfe72_target.call(getObject(arg0));
        return isLikeNone(val) ? 0 : addHeapObject(val);

    };

    const __wbg_firstChild_8f6732445e048d50_target = function() {
        return this.firstChild;
    };

    __exports.__wbg_firstChild_8f6732445e048d50 = function(arg0) {

        const val = __wbg_firstChild_8f6732445e048d50_target.call(getObject(arg0));
        return isLikeNone(val) ? 0 : addHeapObject(val);

    };
    /**
    * @param {number} arg0
    * @param {any} arg1
    * @returns {void}
    */
    __exports.call_first_child_n_times = function(arg0, arg1) {
        try {
            return wasm.call_first_child_n_times(arg0, addBorrowedObject(arg1));

        } finally {
            stack.pop();

        }

    };

    /**
    * @param {number} arg0
    * @param {any} arg1
    * @returns {void}
    */
    __exports.call_first_child_structural_n_times = function(arg0, arg1) {
        try {
            return wasm.call_first_child_structural_n_times(arg0, addBorrowedObject(arg1));

        } finally {
            stack.pop();

        }

    };

    function passArrayJsValueToWasm(array) {
        const ptr = wasm.__wbindgen_malloc(array.length * 4);
        const mem = getUint32Memory();
        for (let i = 0; i < array.length; i++) {
            mem[ptr / 4 + i] = addHeapObject(array[i]);
        }
        return [ptr, array.length];
    }
    /**
    * @param {number} arg0
    * @param {any[]} arg1
    * @returns {void}
    */
    __exports.call_node_first_child_n_times = function(arg0, arg1) {
        const [ptr1, len1] = passArrayJsValueToWasm(arg1);
        return wasm.call_node_first_child_n_times(arg0, ptr1, len1);
    };

    /**
    * @param {number} arg0
    * @param {any[]} arg1
    * @returns {void}
    */
    __exports.call_node_node_type_n_times = function(arg0, arg1) {
        const [ptr1, len1] = passArrayJsValueToWasm(arg1);
        return wasm.call_node_node_type_n_times(arg0, ptr1, len1);
    };

    /**
    * @param {number} arg0
    * @param {any[]} arg1
    * @returns {void}
    */
    __exports.call_node_has_child_nodes_n_times = function(arg0, arg1) {
        const [ptr1, len1] = passArrayJsValueToWasm(arg1);
        return wasm.call_node_has_child_nodes_n_times(arg0, ptr1, len1);
    };

    /**
    * @param {any} arg0
    * @returns {void}
    */
    __exports.count_node_types = function(arg0) {
        return wasm.count_node_types(addHeapObject(arg0));
    };

    const __widl_f_has_child_nodes_Node_target = Node.prototype.hasChildNodes || function() {
        throw new Error(`wasm-bindgen: Node.prototype.hasChildNodes does not exist`);
    };

    __exports.__widl_f_has_child_nodes_Node = function(arg0) {
        return __widl_f_has_child_nodes_Node_target.call(getObject(arg0)) ? 1 : 0;
    };

    const __widl_f_node_type_Node_target = GetOwnOrInheritedPropertyDescriptor(Node.prototype, 'nodeType').get || function() {
        throw new Error(`wasm-bindgen: GetOwnOrInheritedPropertyDescriptor(Node.prototype, 'nodeType').get does not exist`);
    };

    __exports.__widl_f_node_type_Node = function(arg0) {
        return __widl_f_node_type_Node_target.call(getObject(arg0));
    };

    const __widl_f_first_child_Node_target = GetOwnOrInheritedPropertyDescriptor(Node.prototype, 'firstChild').get || function() {
        throw new Error(`wasm-bindgen: GetOwnOrInheritedPropertyDescriptor(Node.prototype, 'firstChild').get does not exist`);
    };

    __exports.__widl_f_first_child_Node = function(arg0) {

        const val = __widl_f_first_child_Node_target.call(getObject(arg0));
        return isLikeNone(val) ? 0 : addHeapObject(val);

    };

    const __widl_f_next_sibling_Node_target = GetOwnOrInheritedPropertyDescriptor(Node.prototype, 'nextSibling').get || function() {
        throw new Error(`wasm-bindgen: GetOwnOrInheritedPropertyDescriptor(Node.prototype, 'nextSibling').get does not exist`);
    };

    __exports.__widl_f_next_sibling_Node = function(arg0) {

        const val = __widl_f_next_sibling_Node_target.call(getObject(arg0));
        return isLikeNone(val) ? 0 : addHeapObject(val);

    };

    function dropRef(idx) {

        idx = idx >> 1;
        if (idx < 4) return;
        let obj = slab[idx];

        obj.cnt -= 1;
        if (obj.cnt > 0) return;

        // If we hit 0 then free up our space in the slab
        slab[idx] = slab_next;
        slab_next = idx;
    }

    __exports.__wbindgen_object_drop_ref = function(i) {
        dropRef(i);
    };

    function takeObject(idx) {
        const ret = getObject(idx);
        dropRef(idx);
        return ret;
    }

    __exports.__wbindgen_rethrow = function(idx) { throw takeObject(idx); };

    let cachedTextDecoder = new TextDecoder('utf-8');

    let cachegetUint8Memory = null;
    function getUint8Memory() {
        if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
            cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
        }
        return cachegetUint8Memory;
    }

    function getStringFromWasm(ptr, len) {
        return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
    }

    __exports.__wbindgen_throw = function(ptr, len) {
        throw new Error(getStringFromWasm(ptr, len));
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
