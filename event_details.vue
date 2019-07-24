<template>
    <div class="main_container" v-if="currentEvent">
        <div class="margin_25_across">
            <div class="promo_main_header sub_title">
                <span class="promo_back all_caps"><i class="fa fa-caret-left"></i>&nbsp;<router-link to="/events">Back to Events</router-link></span>
            </div>

            <div class="row" id="promo_details_container">
                <div class="col-md-4 col-sm-4">
                    <img v-if="currentEvent.image_url" :src="currentEvent.image_url"  alt="Store Logo" class="details_image" />
                </div>
                <div class="col-md-8 col-sm-8" style="padding-bottom: 15px;">
                    <p class="promo_dates sub_title">{{ property.name | uppercase }}</p>
                    <h2 class="promo_list_name">{{currentEvent.name}}</h2>
                    <p class="promo_dates sub_title" v-if="isMultiDay(currentEvent)">
                        {{ currentEvent.start_date | moment("MMMM D", timezone) }} - {{ currentEvent.end_date | moment("MMMM D", timezone) }}
                    </p>
                    <p class="promo_dates sub_title" v-else>{{  currentEvent.start_date | moment("MMMM D", timezone)}}</p>
                    <div class="store_details_desc" v-html="currentEvent.rich_description"></div>
                    <div class="padding_tb_20">
                        <social-sharing :url="shareURL(currentEvent.slug)" :title="currentEvent.title" :description="currentEvent.description" :quote="truncate(currentEvent.description)" twitter-user="ShopCanyonCrest" :media="currentEvent.image_url" inline-template>
                            <div class="blog-social-share">
                                <h5 class="all_caps">Share this Event</h5>
                                <div class="social_share">
                                    <network network="facebook">
                                        <img src="//codecloud.cdn.speedyrails.net/sites/5a1f136e6e6f6472c6240000/image/png/1512057980767/fb@2x_whiteborder.png" alt="Share on Facebook">
                                    </network>
                                    <network network="twitter">
                                        <img src="//codecloud.cdn.speedyrails.net/sites/5a1f136e6e6f6472c6240000/image/png/1512058120246/twt@2x_whiteborder.png" alt="Share on Twitter">
                                    </network>
                                </div>
                            </div>
                        </social-sharing>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    define(["Vue", "vuex","moment", "moment-timezone", "vue-moment"], function(Vue, Vuex, moment, tz, VueMoment) {
        return Vue.component("event-details-component", {
            template: template, // the variable template will be injected,
            props:['id'],
            data: function() {
                return {
                    currentEvent: null
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
                $route : function () {
                    this.updateCurrentEvent(this.$route.params.id);
                },
                currentEvent: function() {
                    if (this.currentEvent.store !== null && this.currentEvent.store !== undefined && _.includes(this.currentEvent.store.store_front_url_abs, 'missing')) {
                        this.currentEvent.store.store_front_url_abs =  this.property.default_logo_url;
                    } else if (this.currentEvent.store == null && this.currentEvent.store == undefined) {
                        this.currentEvent.store = {};
                        this.currentEvent.store.store_front_url_abs =  this.property.default_logo_url;
                    }
                    
                    if (this.currentEvent.image_url != null && this.currentEvent.image_url != undefined && _.includes(this.currentEvent.image_url, 'missing')){
                        this.currentEvent.image_url =  "";
                    }
                }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedEvents',
                    'findEventBySlug',
                    'findEventById'
                ])
            },
            methods: {
                updateCurrentEvent (id) {
                    this.currentEvent = this.findEventBySlug(id);
                    if (this.currentEvent === null || this.currentEvent === undefined){
                        this.$router.replace('/');
                    }
                },
                isMultiDay(currentEvent) {
					var timezone = this.timezone
					var start_date = moment(currentEvent.start_date).tz(timezone).format("MM-DD-YYYY")
					var end_date = moment(currentEvent.end_date).tz(timezone).format("MM-DD-YYYY")
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
