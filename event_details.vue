<template>
    <div class="main_container" v-if="currentEvent">
        <div class="margin_25_across">
            <div class="promo_main_header sub_title">
                <span class="promo_back all_caps"><i class="fa fa-caret-left"></i>&nbsp;<router-link to="/events">Back to Events</router-link></span>
            </div>

            <div class="row mobile_padding" id="promo_details_container">
                <div class="col-md-4 col-sm-4">
                    <img :src="currentEvent.image_url"  alt="Store Logo" class="details_image" />
                </div>
                <div class="col-md-8 col-sm-8" style="padding-bottom: 15px;">
                    <h2 class="promo_list_name">{{currentEvent.name}}</h2>
                    <p class="promo_dates sub_title" v-if="isMultiDay(currentPromo)">
                        {{ currentPromo.start_date | moment("MMMM D", timezone) }} - {{ currentPromo.end_date | moment("MMMM D", timezone) }}
                    </p>
                    <p class="promo_dates sub_title" v-else>{{  currentPromo.start_date | moment("MMMM D", timezone)}}</p>
                    <div class="store_details_desc" v-html="currentEvent.rich_description"></div>
                    <div class="padding_tb_20">
                        <social-sharing :url="shareURL(currentEvent.slug)" :title="currentEvent.title" :description="currentEvent.description" :quote="truncate(currentEvent.description)" twitter-user="ShopCanyonCrest" :media="currentEvent.image_url" inline-template>
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
            <div class="promo_main_header sub_title" v-if="storePromos.length > 0 && property" style="border-top: 1px solid #000;">
                   OTHER {{property.name | uppercase }} EVENTS
            </div>
            <div id="promos_container" v-if="storePromos">
                <div class="col-md-6 col-sm-6 no_padding" v-for="promo in storePromos" :data-cat="promo.cat_list">
                    <div class="promo_item cats_row">
                        <div class="col-md-5 col-xs-4 no_padding">
                            <img class="promo_store_image" :src="promo.store.store_front_url_abs" :alt="promo.name" />
                        </div>
                        <div class="col-md-7 padding_tb_20">
                            <router-link :to="{ name: 'eventDetails', params: { id: promo.slug }}" class="">
                                <h2 class="promo_list_name">{{promo.name}}</h2>
                            </router-link>
                            <p>
                                <span class="promo_dates sub_title">{{promo.start_date | moment("MMM D", timezone)}} - {{promo.end_date | moment("MMM D", timezone)}}</span>
                            </p>
                            <div class="promo_list_desc hidden_phone">{{promo.description_short }}</div>
                            <div class="text_center position_relative hidden_phone">
                                <router-link :to="{ name: 'eventDetails', params: { id: promo.slug }}" class="animated_btn text_center">Read More</router-link>
                            </div>
                        </div>
                    </div>
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
                    currentEvent: null,
                    success_subscribe: false,
                    storePromos: null
                }
            },
            created(){
                this.$store.dispatch("getData", "events").then(response => {
                    this.updateCurrentEvent(this.id);
                }, error => {
                  console.error("Could not retrieve data from server. Please check internet connection and try again.");
                });
            },
            watch: {
                currentEvent: function() {
                    if(this.currentEvent.store !== null && this.currentEvent.store !== undefined && _.includes(this.currentEvent.store.store_front_url_abs, 'missing')) {
                        this.currentEvent.store.store_front_url_abs =  this.property.default_logo_url;
                    }
                    else if (this.currentEvent.store == null && this.currentEvent.store == undefined) {
                        this.currentEvent.store = {};
                        this.currentEvent.store.store_front_url_abs =  this.property.default_logo_url;
                    }
                    if(this.currentEvent.image_url != null && this.currentEvent.image_url != undefined && _.includes(this.currentEvent.image_url, 'missing')){
                        this.currentEvent.image_url =  this.property.default_logo_url;
                    }
                    var vm = this;
                    var temp_promo = [];
                    var current_id = _.toNumber(this.currentEvent.id);
                    _.forEach(this.allEvents, function(value, key) {
                        if (_.toNumber(value.id) != current_id) {
                            var current_promo = vm.findEventById(value.id);
                            current_promo.description_short = _.truncate(current_promo.description, {
                                'length': 50
                            });
                            temp_promo.push(current_promo);
                        }
                    });
                    this.storePromos = temp_promo;
                },
                $route : function () {
                    this.updateCurrentEvent(this.$route.params.id);
                }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedEvents',
                    'findEventBySlug',
                    'findEventById'
                ]),
                allEvents() {
                    var events = this.processedEvents;
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
                updateCurrentEvent (id) {
                    this.currentEvent = this.findEventBySlug(id);
                    if (this.currentEvent === null || this.currentEvent === undefined){
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
                truncate(val_body) {
                    var truncate = _.truncate(val_body, {
                        'length': 99,
                        'separator': ' '
                    });
                    return truncate;
                },
                shareURL(slug) {
                    var share_url = "http://www.shopcanyoncrest.com/events/" + slug;
                    return share_url;
                }
            }
        });
    });
</script>
