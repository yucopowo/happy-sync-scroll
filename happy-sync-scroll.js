

$.extend($.scrollTo.defaults, {
    axis: 'y',
    duration: 0,
    // interrupt: true
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

            // console.log('end');
            // console.log('scrolling', scrolling);
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


            // console.log('scrollFrom', scrollFrom);
            // console.log('scrolling', scrolling);


        });
    });
}
