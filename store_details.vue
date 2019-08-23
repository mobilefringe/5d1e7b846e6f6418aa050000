<template>
    <div class="main_container" v-if="currentStore">
        <div class="margin_25_across">
            <div class="row">
                <div class="col-md-12">
                    <div class="promo_main_header sub_title">
                        <h1 class="sub_title">{{ currentStore.name }}</h1>
                        <div class="store_details_anchors">
                            <a href="/map">
                                <div>
                                    <tt>Map</tt>
                                    <img src="//codecloud.cdn.speedyrails.net/sites/5a1f136e6e6f6472c6240000/image/png/1520025071000/locationicon.png" class="map_icon" alt="">
                                </div>
                            </a>
                            <a id="promo_anchor" href="#promos_main" v-if="promotions.length > 0">
                                <div>
                                    <tt>Promos (<span>{{currentStore.total_published_promos}}</span>)</tt>
                                    <img src="//codecloud.cdn.speedyrails.net/sites/5a1f136e6e6f6472c6240000/image/png/1520025071000/tagicon.png" class="promo_icon" alt="">
                                </div>
                            </a>
                            <a id="job_anchor" href="#jobs_main" v-if="jobs.length > 0">
                                <div>
                                    <tt>Jobs (<span>{{currentStore.total_published_jobs}}</span>)</tt>
                                    <img src="//codecloud.cdn.speedyrails.net/sites/5a1f136e6e6f6472c6240000/image/png/1520025071000/careericon.png" class="job_icon" alt="jobs icon">
                                </div>
                            </a>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-8 col-sm-12">
                            <div id="map">
                                <mapplic-map ref="mapplic_ref" :height="308" :minimap= "false" :deeplinking="false" :sidebar="false" :hovertip="true" :maxscale= "5" :storelist="[currentStore]" :floorlist="floorList" :svgWidth="2000" :svgHeight="2000" tooltiplabel="Info" action="none" :showPin="true" @updateMap="updateMap" :key="currentStore.id" :svgId="'Layer_1'"></mapplic-map>
                            </div>
                        </div>
                        <div class="col-md-4 hidden_phone">
                            <div class="image_container details_store_image">
        						<div v-if="currentStore.no_store_logo" class="store_details_image center-block">
                                    <div class="no_logo">
                                        <img class="store_img" src="//www.mallmaverick.com/system/site_images/photos/000/041/782/original/transparent_logo.png?1533845225" alt="">
                                        <h2 class="store_details_name">{{ currentStore.name }}</h2>
                                    </div>    
                                </div>
                                <img v-else class="store_details_image center-block" :src="currentStore.store_front_url_abs" :alt="currentStore.name + ' Logo'" />
        					</div>
                        </div> 
                    </div>
                    <div class="row">
                        <div class="col-md-8 col-sm-12">
                            <div class="store_details_desc hidden_phone">{{ currentStore.description }}</div>
                        </div>
                        <div class="col-md-4 col-sm-12">
                            <div class="side_stores">
                                <div class="store_header_btns animated_btn" v-if="currentStore.phone">
                                    <a :href="'tel:' + currentStore.phone">
                                        <span>{{ currentStore.phone }}</span>
                                        <i class="fa fa-phone"></i>
                                    </a>
                                </div>
                                <br v-if="currentStore.phone"/>
                                <br/>
                                <div class="store_header_btns animated_btn" v-if="currentStore.website">
                                    <a :href="'http://' + currentStore.website" target="_blank">
                                        <span>Visit Store Website</span>
                                        <i class="fa fa-globe"></i>
                                    </a>
                                </div>
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12" id="hours_main"  v-if="storeHours.length > 0 ">
                    <h2 class="store_details_promo_heading sub_title">{{ currentStore.name }} Hours</h2>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="row" v-for="hour in storeHours">
                                <div class="col-xs-5 col-sm-6 text-left">{{ hour.day_of_week | moment("dddd", timezone) }}</div>
                                <div class="col-xs-7 col-sm-6 text-right">
                                    <span v-if="hour.is_closed">Closed</span>
        						    <span v-else>{{ hour.open_time | moment("h:mm A", timezone) }} - {{ hour.close_time | moment("h:mm A", timezone) }}</span>
        					    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 promo_item" id="promos_main" v-if="currentStore && currentStore.total_published_promos > 0">
                    <h2 class="store_details_promo_heading sub_title">{{ currentStore.name }} Promotions</h2>
                    <div id="promos_container" class="row">
                        <div class="col-md-6" v-for="promo in promotions" :data-cat="promo.cat_list">
                            <div class="promo_item is-table-row">
                                <div class="col-md-5 hidden_mobile">
                                    <img class="promo_store_image" :src="promo.store.image_url" :alt="promo.name" />
                                </div>
                                <div class="col-md-7 padding_tb_20">
                                    <h2 class="promo_list_name text_center">{{ promo.name }}</h2>
                                    <p class="promo_dates sub_title text_center" v-if="isMultiDay(promo)">{{promo.start_date | moment("MMM D", timezone)}} - {{promo.end_date | moment("MMM D", timezone)}}</p>
                                    <p class="promo_dates sub_title text_center" v-else>{{ promo.start_date | moment("MMM D", timezone)}}</p>
                                    <div class="text_center position_relative">
                                        <router-link :to="'/promotions/' + promo.slug" class="animated_btn text_center">View Details</router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 promo_item" id="jobs_main" v-if="currentStore && currentStore.total_published_jobs > 0">
                    <h2 class="store_details_promo_heading sub_title">{{ currentStore.name }} Jobs</h2>
                    <div id="promos_container" class="row">
                        <div class="col-md-6" v-for="promo in jobs" :data-cat="promo.cat_list">
                            <div class="promo_item is-table-row">
                                <div class="col-md-5 hidden_mobile">
                                    <img class="promo_store_image" :src="promo.store.image_url" :alt="promo.name" />
                                </div>
                                <div class="col-md-7 padding_tb_20">
                                    <h2 class="promo_list_name text_center">{{ promo.name }}</h2>
                                    <p class="promo_dates sub_title text_center" v-if="isMultiDay(promo)">{{promo.start_date | moment("MMM D", timezone)}} - {{promo.end_date | moment("MMM D", timezone)}}</p>
                                    <p class="promo_dates sub_title text_center" v-else>{{ promo.start_date | moment("MMM D", timezone)}}</p>
                                    <div class="text_center position_relative">
                                        <router-link :to="'/promotions/' + promo.slug" class="animated_btn text_center">View Details</router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    define(["Vue", "vuex", "vue!mapplic-map", "moment", "moment-timezone", "vue-moment"], function(Vue, Vuex, MapplicComponent, moment, tz, VueMoment) {
        return Vue.component("store-details-component", {
            template: template, // the variable template will be injected,
            data: function() {
                return {
                    currentStore: null,
                    promotions : [],
                    jobs:[],
                    map: null,
                    storeHours :[]
                }
            },
            props:['id'],
            created (){
                this.loadData().then(response => {
                    this.dataLoaded = true;
                    this.updateCurrentStore(this.id);
                });
            },
            watch : {
                currentStore : function (){
                    var vm = this;
                    
                    // STORE LOGO
                    if (_.includes(this.currentStore.store_front_url_abs, 'missing')) {
                        this.currentStore.no_logo = true
                    } else {
                        this.currentStore.no_logo = false
                    }
                        
                    //PROMOTIONS
                    var temp_promo = [];
                    _.forEach(this.currentStore.promotions, function(value, key) {
                        var current_promo = vm.findPromoById(value);
                        current_promo.description_short = _.truncate(current_promo.description, {'length': 70});
                        if (current_promo.store !== null && current_promo.store !== undefined && _.includes(current_promo.store.image_url, 'missing')) {
                            current_promo.store.image_url = vm.property.default_logo_url;
                        } else if (current_promo.store == null && current_promo.store == undefined) {
                            current_promo.store = {};
                            current_promo.store.image_url = vm.property.default_logo_url;
                        }
                        temp_promo.push(current_promo);
                    });
                    this.promotions = temp_promo;
                    
                    // JOBS
                    var temp_job = [];
                    _.forEach(this.currentStore.jobs, function(value, key) {
                        var current_job = vm.findJobById(value);
                        current_job.description_short = _.truncate(current_job.description, {'length': 70});
                        
                        temp_job.push(current_job);
                    });
                    this.jobs = temp_job;

                    // HOURS 
                    var storeHours = [];
                    _.forEach(this.currentStore.store_hours, function (value, key) {
                        var hour = vm.findHourById(value);
                        if (hour.day_of_week === 0){
                            hour.order = 7;
                        } else {
                            hour.order = hour.day_of_week;
                        }
                        storeHours.push(hour);
                    });
                    this.storeHours = _.sortBy(storeHours, [function(o) { return o.order; }]);
                },
                $route : function () {
                    this.updateCurrentStore(this.$route.params.id);
                }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedStores',
                    'findStoreBySlug',
                    'findPromoById',
                    'findJobById',
                    'findHourById'
                ]),
                getSVGurl () {
                    return "https://www.mallmaverick.com" + this.property.svgmap_url;
                },
                floorList () {
                    var floor_list = [];
                    
                    var floor_1 = {};
                    floor_1.id = "first-floor";
                    floor_1.title = "Level One";
                    floor_1.map = this.getSVGurl
                    floor_1.z_index = 1;
                    floor_1.show = true;
                    floor_list.push(floor_1);
                    return floor_list;
                }
            },
            methods: {
                loadData: async function() {
                    try {
                        let results = await Promise.all([
                            this.$store.dispatch("getData","promotions"), 
                            this.$store.dispatch("getData", "jobs")
                        ]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                updateCurrentStore (id) {
                    this.currentStore = this.findStoreBySlug(id);
                    if (this.currentStore === null || this.currentStore === undefined){
                        this.$router.replace('/');
                    }
                },
                updateMap () {
                    this.$refs.mapplic_ref.showLocation(this.currentStore.svgmap_region);
                    this.$refs.mapplic_ref.addActiveClass(this.currentStore.svgmap_region);
                },
                isMultiDay(item) {
					var timezone = this.timezone
					var start_date = moment(item.start_date).tz(timezone).format("MM-DD-YYYY")
					var end_date = moment(item.end_date).tz(timezone).format("MM-DD-YYYY")
					if (start_date === end_date) {
						return false
					} else {
						return true
					}
				}
            }
        });
    });
</script>