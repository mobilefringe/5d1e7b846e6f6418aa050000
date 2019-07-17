<template>
    <div class="main_container" v-if="currentPromo">
        <div class="margin_25_across">
            <div class="promo_main_header sub_title">
                <span class="promo_back all_caps">
                    <i class="fa fa-caret-left"></i>&nbsp;<router-link to="/promotions">Back to Sales & Promos</router-link>
                </span>
            </div>
            <div class="row mobile_padding" id="promo_details_container">
                <div class="col-md-4 col-sm-4">
                    <img :src="currentPromo.image_url"  alt="Store Logo" class="details_image image" />
                </div>
                <div class="col-md-8 col-sm-8" style="padding-bottom: 15px;">
                    <p class="promo_dates sub_title">{{ currentPromo.store.name | uppercase }}</p>
                    <h2 class="promo_list_name">{{currentPromo.name}}</h2>
                    <p class="promo_dates sub_title" v-if="isMultiDay(currentPromo)">
                        {{ currentPromo.start_date | moment("MMMM D", timezone) }} - {{ currentPromo.end_date | moment("MMMM D", timezone) }}
                    </p>
                    <p class="promo_dates sub_title" v-else>{{  currentPromo.start_date | moment("MMMM D", timezone)}}</p>
                    <div class="store_details_desc" v-html="currentPromo.rich_description"></div>
                    <social-sharing :url="shareURL(currentPromo.slug)" :title="currentPromo.title" :description="currentPromo.body" :quote="truncate(currentPromo.description)" twitter-user="ShopCanyonCrest" :media="currentPromo.image_url" inline-template>
                        <div class="blog-social-share">
                            <h5 class="all_caps">Share this Promotion</h5>
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
            <div class="promo_main_header sub_title" v-if="storePromos.length > 0" style="border-top: 1px solid #979797;">
               OTHER {{currentPromo.store.name | uppercase }} PROMOTIONS
            </div>
            <div id="promos_container" class="row" v-if="storePromos">
                <div class="col-md-6 col-sm-6" v-for="promo in storePromos" :data-cat="promo.cat_list">
                    <div class="promo_item cats_row is-table-row">
                        <div class="col-md-5 col-xs-4 no_padding">
                            <img class="promo_store_image" :src="promo.store.store_front_url_abs" :alt="promo.name" />
                        </div>
                        <div class="col-md-7 padding_tb_20">
                            <router-link :to="'/promotions/'+promo.slug" class="">
                                <h2 class="promo_list_name">{{promo.name}}</h2>
                            </router-link>
                            <p>
                                <span class="promo_dates sub_title">{{promo.start_date | moment("MMM D", timezone)}} - {{promo.end_date | moment("MMM D", timezone)}}</span>
                            </p>
                            <div class="promo_list_desc hidden_phone">{{promo.description_short }}</div>
                            <div class="text_center position_relative hidden_phone">
                                <router-link :to="'/promotions/'+promo.slug" class="animated_btn text_center">Read More</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="padding_top_40"></div>
        </div>
    </div>
</template>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "vue-social-sharing"], function(Vue, Vuex, moment, tz, VueMoment, SocialSharing) {
        return Vue.component("promo-details-component", {
            template: template, // the variable template will be injected,
            props:['id'],
            data: function() {
                return {
                    currentPromo: null,
                    storePromos : {}
                }
            },
            created(){
                this.$store.dispatch("getData", "promotions").then(response => {
                    this.updateCurrentPromo(this.id);
                }, error => {
                    console.error("Could not retrieve data from server. Please check internet connection and try again.");
                });
              },
            watch : {
                currentPromo() {
                    if (this.currentPromo != null) {
                        if (this.currentPromo.store != null && this.currentPromo.store != undefined) {
                            if (_.includes(this.currentPromo.image_url, 'missing')){
                                this.currentPromo.image_url =  this.currentPromo.store.store_front_url_abs;
                            }
                            
                            // CHECK FOR ADDITIONAL PROMOS
                            var vm = this;
                            var temp_promo = [];
                            var current_id =_.toNumber(this.currentPromo.id);
                            _.forEach(this.currentPromo.store.promotions, function(value, key) {
                                if (_.toNumber(value) != current_id) {
                                    var current_promo = vm.findPromoById(value);
                                    current_promo.description_short = _.truncate(current_promo.description, {'length': 70});
                                    current_promo.store = vm.currentPromo.store;
                                    if (current_promo.store != null && current_promo.store != undefined && _.includes(current_promo.store.store_front_url_abs, 'missing')){
                                        current_promo.store.store_front_url_abs = vm.property.default_logo_url;
                                    } else if (current_promo.store == null || current_promo.store == undefined) {
                                        current_promo.store = {};
                                        current_promo.store.store_front_url_abs =  vm.property.default_logo_url;
                                    }
                                    temp_promo.push(current_promo);
                                }
                            });
                            this.storePromos = temp_promo;
                        } else {
                            this.currentPromo.store = {};
                            this.currentPromo.store.name = this.property.name;
                            this.currentPromo.store.store_front_url_abs = this.property.default_logo_url;
                        }
                    }
                },
                $route : function () {
                    this.updateCurrentPromo(this.$route.params.id);
                }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'findPromoBySlug',
                    'findPromoById',
                    'timezone'
                ]),
            },
            methods: {
                updateCurrentPromo (id) {
                    this.currentPromo = this.findPromoBySlug(id);
                    if (this.currentPromo === null || this.currentPromo === undefined){
                        this.$router.replace('/');
                    }
                },
                isMultiDay(currentPromo) {
					var timezone = this.timezone
					var start_date = moment(currentPromo.start_date).tz(timezone).format("MM-DD-YYYY")
					var end_date = moment(currentPromo.end_date).tz(timezone).format("MM-DD-YYYY")
					if (start_date === end_date) {
						return false
					} else {
						return true
					}
				},
                truncate(val_body){
                    var truncate = _.truncate(val_body, { 'length': 99, 'separator': ' ' });
                    return truncate;
                },
                shareURL(slug){
                    var share_url = "http://www.shopcanyoncrest.com/promotions/" + slug;
                    return share_url;
                }
            }
        });
    });
</script>
