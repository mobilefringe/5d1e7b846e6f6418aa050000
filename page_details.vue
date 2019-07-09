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
            created() {
                // var temp_repo = this.findRepoByName('Inside Page Banner').images;
                // if (temp_repo != null) {
                //     this.pageBanner = temp_repo[0];
                // } else {
                //     this.pageBanner = {
                //         "image_url": "//codecloud.cdn.speedyrails.net/sites/5c9a464e6e6f6470e9060000/image/png/1554588744991/default_inside_banner.png"
                //     }
                // }
                            
                this.updateCurrentPage(this.id);
            },
            watch: {
                $route: function () {
                    this.updateCurrentPage(this.$route.params.id);
                }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'findRepoByName'
                ])
            },
            methods: {
                updateCurrentPage(id) {
                    this.$nextTick(function() {
                        // Determine the incoming route
                        console.log("this.$route.path", this.$route.path)
                        var route_url = "";
                        if (_.includes(this.$route.path, "privacy-policy")) {
                            route_url = this.property.slug + "-privacy-policy"
                        } else if (_.includes(this.$route.path, "terms-of-use")) {
                            route_url = this.property.slug + "-terms-of-use"
                        } else {
                            route_url = this.id;
                        }
                        
                        var _this = this;
                        this.property.mm_host = this.property.mm_host.replace("http:", "");
                        this.$store.dispatch('LOAD_PAGE_DATA', { url: this.property.mm_host + "/pages/" + route_url + ".json" }).then(function (response) {
                            _this.currentPage = response.data;
                            _this.dataLoaded = true;
                        }, function (error) {
                            console.error( "Could not retrieve data from server. Please check internet connection and try again.");
                            // _this.$router.replace({ name: 'home' });
                        });
                    });
                }
            }
            }
        });
    });
</script>
