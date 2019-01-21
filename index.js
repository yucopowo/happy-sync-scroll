(async function () {

    const template = await (await fetch('./template.html')).text();

    const app = new Vue({
        el: '#app',
        template: template,
        data: {
            panels: [
                {
                    id: 0,
                    backgroundColor: 'rgba(166, 0, 187, 0.3)'
                },
                {
                    id: 1,
                    backgroundColor: 'rgba(0, 0, 204, 0.3)'
                },
                {
                    id: 2,
                    backgroundColor: 'rgba(42, 204, 76, 0.3)'
                }
            ]
        },
        mounted() {
            console.log(this.$refs);
            const self = this;
            const panels = [];
            Object.keys(this.$refs).forEach(function (ref) {
                panels.push(self.$refs[ref][0]);
            });
            const syncScroll = new HappySyncScroll(panels, {

            });
        }
    });

})();
