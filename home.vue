<template>
    <div class="row" v-if="dataLoaded">
        <slick ref="slick" :options="slickOptions">
            <div v-for="(item, index) in banners" v-if="banners.length > 0">
                <div v-lazy:background-image="item.image_url" class="banner_image_div">
                    <router-link v-if="item.url" :to="item.url" class="banner_image_li"></router-link>
                    <router-link v-else to="/" class="banner_image_li"></router-link>
                </div>
            </div>
        </slick>
        <div class="content_container main_container  position_relative">
            <!--<div class="feature_row" id="feature_container_2">-->
            <!--    <div class="feature_item_container" v-for="item in feature_items">-->
            <!--        <div class="feature_item wow animated flipInX animated teamy-team">-->
            <!--            <article class="teamy teamy_style2 teamy_mask-circle teamy_zoom-photo">-->
            <!--                <div class="teamy__layout">-->
            <!--                    <router-link  v-if="item.url" :to="item.url">-->
            <!--                        <div class="teamy__preview">-->
            <!--                            <img :src="item.image_url" class="teamy__avatar" alt="The demo photo">-->
            <!--                        </div>-->
            <!--                        <div class="teamy__back"></div>-->
            <!--                        <p class="feature_text">{{item.name}}</p>-->
            <!--                    </router-link>-->
            <!--                    <router-link v-else to="/">-->
            <!--                        <div class="teamy__preview">-->
            <!--                            <img :src="item.image_url" class="teamy__avatar" alt="The demo photo">-->
            <!--                        </div>-->
            <!--                        <div class="teamy__back"></div>-->
            <!--                        <p class="feature_text">{{item.name}}</p>-->
            <!--                    </router-link>-->
            <!--                </div>-->
            <!--            </article>-->
            <!--        </div>-->
            <!--    </div>-->
            <!--</div>-->
            <div class="promotions" id="feature_promotions" v-if="promotions.length > 0">
                <h3 class="promotion_heading">Upcoming Events & Promotions!</h3>
                <p class="exclusive_deals sub_title">Don’t miss our exclusive deals & events</p>
                
                <div class="home_promotions feature_row" id="promos_container">
                    <div class="promotion_item wow animated flipInX animated teamy-team text_center" v-for="promo in promotions">
                        <hr class="show_phone" />
                        <p class="promotion_dates">{{promo.start_date | moment("MMM D", timezone)}} - {{promo.end_date | moment("MMM D", timezone)}}</p>
                        <article class="teamy teamy_style2 teamy_mask-circle teamy_zoom-photo">
                            <div class="teamy__layout">
                                <router-link :to="'/promotions/'+promo.slug">
                                    <div class="teamy__preview">
                                        <img :src="promo.image_url" class="teamy__avatar featured_promo_img" alt="The demo photo">
                                    </div>
                                    <div class="teamy__back">
                                        <div class="teamy__back-inner">
                                            <div class="teamy__content">
                                                <h3 class="teamy__name">View Details</h3>
                                            </div>
                                        </div>
                                    </div>
                                </router-link>
                            </div>
                        </article>
                        <h3 class="promotion_header home_promos">{{promo.name}}</h3>
                        <router-link :to="'/promotions/'+promo.slug" class="animated_btn text_center">Read More</router-link>
                    </div>
                </div>
                <hr class="show_phone" />
                <div class="clearfix"></div>
            </div>
        </div>
        
        <div class="content_container  position_relative hidden_phone" style="padding:0">
            <div class="main_container">
                <div class="newsletter_container text-center">
                        <h2 class="heading">SIGN UP TO RECEIVE OUR UPDATES</h2>
                        <p class="newsletter_desc sub_title">Special Offers <br class="show_phone" /><span>•</span> New Store Openings <br class="show_phone" /><span>•</span> Exclusive Events</p>
                        <router-link to="/newsletter" class="animated_btn newsletter_btn">Subscribe</router-link>
                    </div>
                 <hr/>
            </div>
            <!--<h2 class="promotion_heading text-center visit_us_header">Visit Us!</h2>-->
            <iframe  class="grayscale visit_us_iframe hidden_phone" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2198.58586155242!2d-117.33154422162433!3d33.95621236060249!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dcafb3e8e622a7%3A0x9e4673950258330a!2s5225+Canyon+Crest+Dr%2C+Riverside%2C+CA+92507%2C+USA!5e0!3m2!1sen!2sca!4v1511989451889"  width="100%" height="300" frameborder="0" style="border:0" allowfullscreen></iframe>
            <hr class="hidden_phone"/>
        </div>
        <!--<div class="content_container position_relative main_container show_phone ">-->
        <!--   <h2 class="promotion_heading text-center visit_us_header">VISIT US!</h2>-->
        <!--    <iframe  class="grayscale visit_us_iframe" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2198.58586155242!2d-117.33154422162433!3d33.95621236060249!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dcafb3e8e622a7%3A0x9e4673950258330a!2s5225+Canyon+Crest+Dr%2C+Riverside%2C+CA+92507%2C+USA!5e0!3m2!1sen!2sca!4v1511989451889"  width="100%" height="300" frameborder="0" style="border:0" allowfullscreen></iframe>-->
        <!--</div>-->
    </div>
</template>

<script>
    define(["Vue", "vuex", "vue!today_hours", "vue!vue-slick","moment", "moment-timezone", "vue-moment", "vue-meta",'vue-lazy-load'], function(Vue, Vuex, TodayHoursComponent, slick ,moment, tz, VueMoment, Meta,VueLazyload) {
        Vue.use(VueLazyload);
        return Vue.component("home-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    suggestionAttribute: 'name',
                    search: '',
                    slickOptions: {
                        slidesToShow: 1,
                        dots : true,
                        arrows:true,
                        prevArrow: '.prev',
                        nextArrow: '.next',
                        autoplay: false
                        // Any other options that can be got from plugin documentation
                    },
                    dataLoaded: false,
                    meta: {
                        meta_title: "",
                        meta_description: "",
                        meta_keywords: ""
                    }
                }
            },
            created () {
                this.loadData().then(response => {
                    this.dataLoaded = true;
                    this.meta = this.findMetaDataByPath(this.$route.path);
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedPromos',
                    'findMetaDataByPath'
                ]),
                banners () {
                    return _.orderBy(this.$store.state.banners, ['position'], ['asc']);
                },
                feature_items () {
                    return  _.slice(this.$store.state.feature_items, 0, 3);
                },
                promotions () {
                    this.processedPromos.map(promo => {
                        if(promo.store != null && promo.store != undefined && _.includes(promo.store.store_front_url_abs, 'missing')){
                            promo.store.store_front_url_abs =  this.property.default_logo_url;
                        }
                        else if (promo.store == null && promo.store == undefined) {
                            promo.store = {};
                            promo.store.store_front_url_abs =  this.property.default_logo_url;
                        }
                        
                        if(promo.image_url != null && promo.image_url != undefined && _.includes(promo.image_url, 'missing')){
                            promo.image_url =  promo.store.store_front_url_abs;
                        }
                    });
                    promos =  _.sortBy(this.processedPromos, [function(o) { return o.created_at; }]).reverse();
                    return _.slice(promos, [0], [3]);
                }
            },
            methods: {
                loadData: async function() {
                    try {
                        // avoid making LOAD_META_DATA call for now as it will cause the entire Promise.all to fail since no meta data is set up.
                        let results = await Promise.all([this.$store.dispatch("getData", "banners"), this.$store.dispatch("getData", "feature_items"), this.$store.dispatch("getData", "promotions")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
            },
            metaInfo () {
                return {
                    title: this.meta.meta_title,
                    meta: [
                        {name: 'description', content: this.meta.meta_description},
                        {name: 'keywords', content: this.meta.meta_keywords}
                    ] 
                }
            }
        })
    })
</script>
