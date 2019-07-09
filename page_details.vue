<template>
    <div>
        <div class="main_container " v-if="currentPage">
            <h4 class="page_title promo_main_header" v-html="currentPage.title"></h4>
            <div class="row padding_30" >
                <div class="description_text text_left" v-html="currentPage.body"></div>
            </div>
        </div>
    </div>
</template>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment"], function(Vue, Vuex, moment, tz, VueMoment) {
        return Vue.component("page-details-component", {
            template: template, // the variable template will be injected,
            data: function() {
                return {
                    currentPage: null
                }
            },
            beforeRouteEnter(to, from, next) {
                next(vm => {
                    // access to component instance via `vm`
                    console.log("route", this.$route.path);
                    // if () {
                        
                    // }
                    // var url = 
                    vm.$store.dispatch('LOAD_PAGE_DATA', {
                        url: vm.property.mm_host + "/pages/" + to.params.id + ".json"
                    }).then(response => {
                        vm.currentPage = response.data;
                    }, error => {
                        console.error("Could not retrieve data from server. Please check internet connection and try again.");
                        vm.$router.replace('/');
                    });
                })
            },
            beforeRouteUpdate(to, from, next) {
                console.log("route", this.$route.path);
                this.$store.dispatch('LOAD_PAGE_DATA', {
                    url: this.property.mm_host + "/pages/" + to.params.id + ".json"
                }).then(response => {
                    // this.dataLoaded = true;
                    this.currentPage = response.data;
                }, error => {
                    console.error("Could not retrieve data from server. Please check internet connection and try again.");
                    this.$router.replace('/');
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                ]),
            }
        });
    });
</script>
