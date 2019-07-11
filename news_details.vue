<template>
    <div class="row main_container" v-if="currentNews">
        <div class="promo_main_header sub_title" v-if="property">
                {{property.name | uppercase}}
        </div>
        <div class="row mobile_padding" id="promo_details_container">
            <div class="col-md-4 col-sm-4">
                <img :src="currentNews.image_url"  alt="Store Logo" class="details_image" />
            </div>
            <div class="col-md-8 col-sm-8" style="padding-bottom: 15px;">
                <h2 class="promo_list_name">{{currentNews.name}}</h2>
                <p class="promo_dates sub_title">{{currentNews.start_date | moment("MMM D", timezone)}} - {{currentNews.end_date | moment("MMM D", timezone)}}</p>
                <div class="store_details_desc" v-html="currentNews.rich_description"></div>
                <div class="padding_tb_20">
                    <social-sharing :url="shareURL(currentNews.slug)" :title="currentNews.title" :description="currentNews.description" :quote="truncate(currentNews.description)" twitter-user="ShopCanyonCrest" :media="currentNews.image_url" inline-template>
                        <div class="blog-social-share">
                            <h5>Share this event</h5>
                            <div class="social_share">
                                <network network="facebook">
                                    <img src="//codecloud.cdn.speedyrails.net/sites/5a1f136e6e6f6472c6240000/image/png/1512057980767/fb@2x_whiteborder.png" class="" alt="">
                                </network>
                                <network network="twitter">
                                    <img src="//codecloud.cdn.speedyrails.net/sites/5a1f136e6e6f6472c6240000/image/png/1512058120246/twt@2x_whiteborder.png" class="" alt="">
                                </network>
                            </div>
                        </div>
                    </social-sharing>
                </div>
            </div>
        </div>
        <div class="padding_top_40"></div>
    </div>
</template>

<script>
    define(["Vue", "vuex","moment", "moment-timezone", "vue-moment"], function(Vue, Vuex, moment, tz, VueMoment) {
        return Vue.component("event-details-component", {
            template: template, // the variable template will be injected,
            props:['id'],
            data: function() {
                return {
                    currentNews: null,
                    success_subscribe: false,
                    storePromos: null
                }
            },
            created(){
                this.$store.dispatch("getData", "news").then(response => {
                    this.updateCurrentNews(this.id);
                }, error => {
                    console.error("Could not retrieve data from server. Please check internet connection and try again.");
                });
            },
            watch: {
                currentNews: function() {
                    if(this.currentNews.store !== null && this.currentNews.store !== undefined && _.includes(this.currentNews.store.store_front_url_abs, 'missing')) {
                        this.currentNews.store.store_front_url_abs =  this.property.default_logo_url;
                    }
                    else if (this.currentNews.store == null && this.currentNews.store == undefined) {
                        this.currentNews.store = {};
                        this.currentNews.store.store_front_url_abs =  this.property.default_logo_url;
                    }
                    if(this.currentNews.image_url != null && this.currentNews.image_url != undefined && _.includes(this.currentNews.image_url, 'missing')){
                        this.currentNews.image_url =  this.property.default_logo_url;
                    }
                    var vm = this;
                    var temp_promo = [];
                    var current_id = _.toNumber(this.currentNews.id);
                    _.forEach(this.allNews, function(value, key) {
                        if (_.toNumber(value.id) != current_id) {
                            var current_news = vm.findNewsById(value.id);
                            current_news.description_short = _.truncate(current_news.description, {
                                'length': 50
                            });
                            temp_promo.push(current_news);
                        }
                    });
                    this.storePromos = temp_promo;
                },
                $route : function () {
                    this.updateCurrentNews(this.$route.params.id);
                }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedNews',
                    'findNewsBySlug',
                    'findNewsById'
                ]),
                allNews() {
                    var events = this.processedNews;
                    var vm = this;
                    events.map(event => {
                        if(event.store != null && event.store != undefined && _.includes(event.store.store_front_url_abs, 'missing')){
                            event.store.store_front_url_abs =  vm.property.default_logo_url;
                        }
                        else if (event.store == null && event.store == undefined) {
                            event.store = {};
                            event.store.store_front_url_abs =  vm.property.default_logo_url;
                        }
                        
                        if(event.image_url != null && event.image_url != undefined && _.includes(event.image_url, 'missing')){
                            event.image_url =  event.store.store_front_url_abs
                        }
                    });
                    return events;
                },
            },
            methods: {
                updateCurrentNews (id) {
                    this.currentNews = this.findNewsBySlug(id);
                    if (this.currentNews === null || this.currentNews === undefined){
                        this.$router.replace('/');
                    }
                },
                truncate(val_body) {
                    var truncate = _.truncate(val_body, {
                        'length': 99,
                        'separator': ' '
                    });
                    return truncate;
                },
                shareURL(slug) {
                    var share_url = "https://kanatacentral.com/news/" + slug;
                    return share_url;
                }
            }
        });
    });
</script>
