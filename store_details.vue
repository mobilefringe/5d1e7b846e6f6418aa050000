<template>
    <div class="row main_container" v-if="currentStore">
        <div id="store_container">
           <div class="promo_main_header sub_title">
                {{currentStore.name}}
                <div class="store_details_anchors pull-right">
                    <a href="/map">
                        <tt>Map</tt>
                        <img src="//codecloud.cdn.speedyrails.net/sites/5a1f136e6e6f6472c6240000/image/png/1520025071000/locationicon.png" class="map_icon" alt="">
                    </a>
                    <a id="promo_anchor" href="#promos_main" v-if="promotions.length > 0">
                        <tt>Promos (<span>{{currentStore.total_published_promos}}</span>)</tt>
                        <img src="//codecloud.cdn.speedyrails.net/sites/5a1f136e6e6f6472c6240000/image/png/1520025071000/tagicon.png" class="promo_icon" alt="">
                    </a>
                    <a id="job_anchor" href="#jobs_main" v-if="jobs.length > 0">
                        <tt>Jobs (<span>{{currentStore.total_published_jobs}}</span>)</tt>
                        <img src="//codecloud.cdn.speedyrails.net/sites/5a1f136e6e6f6472c6240000/image/png/1520025071000/careericon.png" class="job_icon" alt="jobs icon">
                    </a>
                </div>
            </div>
            <div class="row" style="width:100%;">
                <div class="col-md-8 col-sm-8  col-xs-12">
                    <div id="map">
                        <!--<svg-map ref="svgRef" @updateMap="updateSVGMap" :svgMapUrl="getSVGurl" :zoomLimit="[0,20]" :colours="{selected: '#b0931c',hover:'#c3a11f'}" :zoomButtons="{show: true,location: 'right' }"></svg-map>-->
                        <mapplic-map ref="mapplic_ref" :height="300" :minimap= "false" :deeplinking="false" :sidebar="false" :hovertip="true" :maxscale= "5" :storelist="[currentStore]" :floorlist="floorList" :svgWidth="2000" :svgHeight="2000" tooltiplabel="Info" action="none" :showPin="true" @updateMap="updateMap" :key="currentStore.id" :svgId="'Layer_1'"></mapplic-map>
                    </div>
                    
                </div>
                <div class="col-md-4 col-sm-4" style="max-width: 346px;">
                    <img :src="currentStore.image_url" class="store_logo hidden_phone" :alt="currentStore.name" style="margin:0;max-width:100%;" />
                   
                </div> 
            </div>
            <div class="row " style="width:100%;">
                <div class="col-md-8 col-sm-8 ">
                    <div class="store_details_desc hidden_phone">{{currentStore.description}}</div>
                </div>
                <div class="col-md-4 col-sm-4">
                    <div class="side_stores">
                        <div class="store_header_btns animated_btn" v-if="currentStore.phone">
                            <a :href="'tel:'+currentStore.phone"><i class="fa fa-phone"></i>&nbsp;{{currentStore.phone}}</a>
                        </div>
                        <br v-if="currentStore.phone"/>
                        <br/>
                        <div class="store_header_btns animated_btn" v-if="currentStore.website">
                            <a :href="'http://' + currentStore.website" target="_blank"><i class="fa fa-globe"></i>&nbsp;Visit Store Website</a>
                        </div>
                    </div>
                </div> 
            </div>
        </div>
        <div class="row">
            <div class="col-md-12 promo_item" id="hours_main"  v-if="storeHours.length > 0 ">
                <h2 class="store_details_promo_heading sub_title">
                   {{currentStore.name}} Hours
                </h2>
                <div id="promos_container" class="col-sm-6 no_padding" style="color:#424242;">
                    <div class="no_padding" v-for="hour in storeHours">
                        <span class="col-xs-4 text-left" style="padding-top:3px;">{{hour.day_of_week | moment("dddd", timezone)}}</span>
                        <span v-if="hour.is_closed" class="col-xs-6 text-left" style="padding-top:3px;">Closed</span>
						<span v-else class="col-xs-6 text-left" style="padding-top:3px;">{{hour.open_time | moment("h A", timezone)}} - {{hour.close_time | moment("h A", timezone)}}</span>
                    </div>
                </div>
            </div>
            <div class="col-md-12 promo_item" id="promos_main" v-if="currentStore && currentStore.total_published_promos > 0">
                <h2 class="store_details_promo_heading sub_title">
                    {{currentStore.name}} Promotions
                </h2>
                <div id="promos_container">
                    <div class="col-md-6 col-sm-6 no_padding" v-for="promo in promotions" :data-cat="promo.cat_list">
                        <div class="promo_item cats_row is-table-row">
                            <div class="col-md-5 col-xs-4 no_padding">
                                <img class="promo_store_image" :src="promo.store.image_url" :alt="promo.name" />
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
            </div>
            <div class="col-md-12 promo_item" id="jobs_main" v-if="currentStore && currentStore.total_published_jobs > 0">
                <h2 class="store_details_promo_heading sub_title">
                    {{currentStore.name}} Jobs
                </h2>
                <div id="jobs_container">
                    <div class="col-md-6 col-sm-6" v-for="job in jobs" :data-cat="job.cat_list">
                        <div class="promo_item cats_row is-table-row">
                            <div class="col-md-5 col-xs-4 no_padding">
                                <img class="promo_store_image" :src="currentStore.image_url" :alt="job.name" />
                            </div>
                            <div class="col-md-7 padding_tb_20">
                                <h2 class="promo_list_name">{{job.name}}</h2>
                                <p>
                                    <span class="promo_dates sub_title">{{job.start_date | moment("MMM D", timezone)}} </span>
                                </p>
                                <div class="promo_list_desc">{{job.description_short }}</div>
                                <div class="text_center position_relative">
                                    <router-link :to="'/jobs/'+job.slug" class="animated_btn text_center">Read More</router-link>
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
    define(["Vue","vuex", "vue!mapplic-map"], function(Vue, Vuex, MapplicComponent) {
        //  define(["Vue","vuex", "jquery", "Raphael", "mm_mapsvg","mousewheel","vue!svg-map", "vue2-filters"], function(Vue, Vuex, $, Raphael, mapSvg,mousewheel,SVGMapComponent, Vue2Filters) {
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
                    if ( _.includes(this.currentStore.store_front_url_abs, 'missing')) {
                        this.currentStore.store_front_url_abs = "//codecloud.cdn.speedyrails.net/sites/5a6a54eb6e6f647da51e0100/image/png/1516652189884/ES_logo_red2.png";
                    }
                    var vm = this;
                    var temp_promo = [];
                    var temp_job = [];
                    _.forEach(this.currentStore.promotions, function(value, key) {
                        var current_promo = vm.findPromoById(value);
                        current_promo.description_short = _.truncate(current_promo.description, {'length': 70});
                        if(current_promo.store !== null && current_promo.store !== undefined && _.includes(current_promo.store.image_url, 'missing')) {
                            current_promo.store.image_url = "//codecloud.cdn.speedyrails.net/sites/5a1f136e6e6f6472c6240000/image/jpeg/1515531874445/canyon_crest_default.jpg";
                        }
                        else if (current_promo.store == null && current_promo.store == undefined) {
                            current_promo.store = {};
                            current_promo.store.image_url = "//codecloud.cdn.speedyrails.net/sites/5a1f136e6e6f6472c6240000/image/jpeg/1515531874445/canyon_crest_default.jpg";
                        }
                        temp_promo.push(current_promo);
                    });
                    _.forEach(this.currentStore.jobs, function(value, key) {
                        var current_job = vm.findJobById(value);
                        current_job.description_short = _.truncate(current_job.description, {'length': 70});
                        
                        temp_job.push(current_job);
                        
                    });
                    if(_.includes(this.currentStore.image_url, 'missing'))
                        this.currentStore.image_url = "//codecloud.cdn.speedyrails.net/sites/5a1f136e6e6f6472c6240000/image/jpeg/1515531874445/canyon_crest_default.jpg";
                    this.promotions = temp_promo;
                    this.jobs = temp_job;
                    var storeHours = [];
                    var vm = this;
                    _.forEach(this.currentStore.store_hours, function (value, key) {
                        var hour = vm.findHourById(value);
                        if(hour.day_of_week === 0){
                            hour.order = 7;
                        }
                        else {
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
                        // avoid making LOAD_META_DATA call for now as it will cause the entire Promise.all to fail since no meta data is set up.
                        let results = await Promise.all([this.$store.dispatch("getData","promotions"), this.$store.dispatch("getData", "jobs")]);
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
                }
            },
        });
    });
</script>