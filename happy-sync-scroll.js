var MoveTo = function () {
    /**
     * Defaults
     * @type {object}
     */
    var defaults = {
        tolerance: 0,
        // duration: 800,
        duration: 50,
        easing: 'easeOutQuart',
        container: window,
        callback: function callback() {} };


    /**
     * easeOutQuart Easing Function
     * @param  {number} t - current time
     * @param  {number} b - start value
     * @param  {number} c - change in value
     * @param  {number} d - duration
     * @return {number} - calculated value
     */
    function easeOutQuart(t, b, c, d) {
        t /= d;
        t--;
        return -c * (t * t * t * t - 1) + b;
    }

    /**
     * Merge two object
     *
     * @param  {object} obj1
     * @param  {object} obj2
     * @return {object} merged object
     */
    function mergeObject(obj1, obj2) {
        var obj3 = {};
        Object.keys(obj1).forEach(function (propertyName) {
            obj3[propertyName] = obj1[propertyName];
        });

        Object.keys(obj2).forEach(function (propertyName) {
            obj3[propertyName] = obj2[propertyName];
        });
        return obj3;
    };

    /**
     * Converts camel case to kebab case
     * @param  {string} val the value to be converted
     * @return {string} the converted value
     */
    function kebabCase(val) {
        return val.replace(/([A-Z])/g, function ($1) {
            return '-' + $1.toLowerCase();
        });
    };

    /**
     * Count a number of item scrolled top
     * @param  {Window|HTMLElement} container
     * @return {number}
     */
    function countScrollTop(container) {
        if (container instanceof HTMLElement) {
            return container.scrollTop;
        }
        return container.pageYOffset;
    };

    /**
     * MoveTo Constructor
     * @param {object} options Options
     * @param {object} easeFunctions Custom ease functions
     */
    function MoveTo() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};var easeFunctions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        this.options = mergeObject(defaults, options);
        this.easeFunctions = mergeObject({ easeOutQuart: easeOutQuart }, easeFunctions);
    }

    /**
     * Register a dom element as trigger
     * @param  {HTMLElement} dom Dom trigger element
     * @param  {function} callback Callback function
     * @return {function|void} unregister function
     */
    MoveTo.prototype.registerTrigger = function (dom, callback) {var _this = this;
        if (!dom) {
            return;
        }

        var href = dom.getAttribute('href') || dom.getAttribute('data-target');
        // The element to be scrolled
        var target = href && href !== '#' ?
            document.getElementById(href.substring(1)) :
            document.body;
        var options = mergeObject(this.options, _getOptionsFromTriggerDom(dom, this.options));

        if (typeof callback === 'function') {
            options.callback = callback;
        }

        var listener = function listener(e) {
            e.preventDefault();
            _this.move(target, options);
        };

        dom.addEventListener('click', listener, false);

        return function () {return dom.removeEventListener('click', listener, false);};
    };

    /**
     * Move
     * Scrolls to given element by using easeOutQuart function
     * @param  {HTMLElement|number} target Target element to be scrolled or target position
     * @param  {object} options Custom options
     */
    MoveTo.prototype.move = function (target) {var _this2 = this;var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        if (target !== 0 && !target) {
            return;
        }

        options = mergeObject(this.options, options);

        // debugger
        // var distance = typeof target === 'number' ? target : target.getBoundingClientRect().top;
        // var distance = 0;
        var getBoundingClientRect = target.getBoundingClientRect();
        var distance = typeof target === 'number' ? target : (getBoundingClientRect.top - getBoundingClientRect.height);


        var from = countScrollTop(options.container);
        var startTime = null;
        var lastYOffset = void 0;
        distance -= options.tolerance;

        // rAF loop
        var loop = function loop(currentTime) {
            var currentYOffset = countScrollTop(_this2.options.container);

            if (!startTime) {
                // To starts time from 1, we subtracted 1 from current time
                // If time starts from 1 The first loop will not do anything,
                // because easing value will be zero
                startTime = currentTime - 1;
            }

            var timeElapsed = currentTime - startTime;

            if (lastYOffset) {
                if (
                    distance > 0 && lastYOffset > currentYOffset ||
                    distance < 0 && lastYOffset < currentYOffset)
                {
                    return options.callback(target);
                }
            }
            lastYOffset = currentYOffset;

            var val = _this2.easeFunctions[options.easing](timeElapsed, from, distance, options.duration);

            options.container.scroll(0, val);

            if (timeElapsed < options.duration) {
                window.requestAnimationFrame(loop);
            } else {
                options.container.scroll(0, distance + from);
                options.callback(target);
            }
        };

        window.requestAnimationFrame(loop);
    };

    /**
     * Adds custom ease function
     * @param {string}   name Ease function name
     * @param {function} fn   Ease function
     */
    MoveTo.prototype.addEaseFunction = function (name, fn) {
        this.easeFunctions[name] = fn;
    };

    /**
     * Returns options which created from trigger dom element
     * @param  {HTMLElement} dom Trigger dom element
     * @param  {object} options The instance's options
     * @return {object} The options which created from trigger dom element
     */
    function _getOptionsFromTriggerDom(dom, options) {
        var domOptions = {};

        Object.keys(options).forEach(function (key) {
            var value = dom.getAttribute('data-mt-' + kebabCase(key));
            if (value) {
                domOptions[key] = isNaN(value) ? value : parseInt(value, 10);
            }
        });
        return domOptions;
    }

    return MoveTo;
}();


$.extend($.scrollTo.defaults, {
    axis: 'y',
    duration: 30,
    interrupt: true
});


function inViewport(el){
    var rect = el.getBoundingClientRect();
    var innerHeight = window.innerHeight || document.documentElement.clientHeight;
    var innerWidth = window.innerWidth || document.documentElement.clientWidth;

    return rect.top >= 0
        && rect.left >= 0
        && rect.bottom <= innerHeight
        && rect.right <= innerWidth;
}

function scrollTo($container, percent, callback) {
    const $wrap = $container.find('.happy-sync-scroll-wrap');
    const wrapHeight = $wrap.height();
    const containerHeight = $container.height();
    const scrollTop = (percent * (wrapHeight-containerHeight)) / 100;
    // $container.scrollTop(scrollTop);
    // $container.stop();
    $container.scrollTo(scrollTop, {
        onAfter: callback
    });
}


let scrollFrom = -1;
let scrolling = 0;

function onScroll(index, $containers, callback) {



    // if(scrollFrom !== index){
    //     return;
    // }


    const $container = $containers[index];

    // if(!$container.data('scrolling')){
    //     return;
    // }

    // $container.data('scrolling', true);

    // console.log( $containers );
    // console.log( $containers.scrollTop() );
    const scrollTop = $container.scrollTop();
    // console.log( scrollTop );

    const $wrap = $container.find('.happy-sync-scroll-wrap');

    // console.log( $container.height() );
    // console.log( $wrap.height() );

    const wrapHeight = $wrap.height();
    const containerHeight = $container.height();
    const percent = (scrollTop / (wrapHeight-containerHeight)) * 100;

    // console.log( percent );

    for(let i=0;i<$containers.length;i++){
        if(i === index || i=== scrollFrom) {
            continue;
        }

        scrolling++;

        scrollTo($containers[i], percent, function () {
            scrolling--;

            console.log('end');
            console.log('scrolling', scrolling);
            // $container.data('scrolling', false);
            // scrolling = false;

            if(scrolling <= 0){
                scrolling = 0;
                scrollFrom = -1;
            }

        });
    }

}

function HappySyncScroll(containers, options) {

    const $containers = [];

    $.each(containers, function (index, container) {

        const $container = $(container);
        $container.data('index', index);

        $containers.push($container);

        $container.on('scroll', function () {
            const i = $(this).data('index');


            if( scrollFrom>=0 && scrollFrom !== i ){
                return;
            }


            // if(scrolling>0 && scrollFrom === i){
            //     return;
            // }

            if(scrollFrom < 0){
                scrollFrom = i;
            }

            // if(scrollFrom < 0 && scrolling <= 0){
            //     scrollFrom = -1;
            // }

            // scrollFrom = i;
            // onScroll($containers[i]);
            // console.log( $containers[i] );

            // if(scrolling>0){
            //     return;
            // }

            onScroll(i, $containers);


            console.log('scrollFrom', scrollFrom);
            console.log('scrolling', scrolling);


        });
    });
}
