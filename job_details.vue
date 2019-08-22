<template>
    <div class="row main_container" v-if="currentJob">
        <div class="promo_main_header sub_title" v-if="currentJob.store">
                {{currentJob.store.name | uppercase}}
        </div>
        <div class="promo_main_header sub_title" v-else>
                {{property.name | uppercase}}
        </div>
        <div class="row mobile_padding" id="promo_details_container">
            <div class="col-md-4 col-sm-4">
                <img v-if="currentJob.store" :src="currentJob.store.store_front_url_abs"  alt="Store Logo" class="details_image" />
                <img class="details_image" v-else src="//codecloud.cdn.speedyrails.net/sites/5a1f136e6e6f6472c6240000/image/png/1513356843893/canyon_crest_logo.png" :alt="property.name" />
            </div>
            <div class="col-md-8 col-sm-8">
                <h2 class="promo_list_name">{{currentJob.name}}</h2>
                <p class="promo_dates sub_title">{{currentJob.start_date | moment("MMM D", timezone)}} - {{currentJob.end_date | moment("MMM D", timezone)}}</p>
                <div class="store_details_desc">{{currentJob.description}}</div>
                <div class=" padding_tb_20">
                    <social-sharing :url="shareURL(currentJob.slug)" :title="currentJob.title" :description="currentJob.body" :quote="truncate(currentJob.description)" twitter-user="ShopCanyonCrest" :media="currentJob.image_url" inline-template>
                        <div class="blog-social-share">
                            <h5>Share this promotion</h5>
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
        <div class="promo_main_header sub_title" v-if="storeJobs.length > 0 && property" style="border-top: 1px solid #000;">
               OTHER {{currentJob.store.name | uppercase }} JOBS
        </div>
        <div id="promos_container" v-if="storeJobs.length > 0">
            <div class="col-md-6 col-sm-6 no_padding" v-for="promo in storeJobs" :data-cat="promo.cat_list">
                <div class="promo_item cats_row is-table-row">
                    <div class="col-md-5 col-xs-4 no_padding">
                        <img class="promo_store_image" :src="promo.store.store_front_url_abs" :alt="promo.name" />
                    </div>
                    <div class="col-md-7 padding_tb_20">
                        <router-link :to="'/jobs/'+promo.slug" class="">
                            <h2 class="promo_list_name">{{promo.name}}</h2>
                        </router-link>
                        <p>
                            <span class="promo_dates sub_title">{{promo.start_date | moment("MMM D", timezone)}} - {{promo.end_date | moment("MMM D", timezone)}}</span>
                        </p>
                        <div class="promo_list_desc hidden_phone">{{promo.description_short }}</div>
                        <div class="text_center position_relative hidden_phone">
                            <router-link :to="'/jobs/'+promo.slug" class="animated_btn text_center">Read More</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment"], function(Vue, Vuex, moment, tz, VueMoment) {
        return Vue.component("job-details-component", {
            template: template, // the variable template will be injected,
            data: function() {
                return {
                    currentJob: null,
                    success_subscribe: false,
                    storeJobs: null
                }
            },
            props:['id'],
            created(){
                this.$store.dispatch("getData", "jobs").then(response => {
                    this.updateCurrentJob(this.id);
                }, error => {
                  console.error("Could not retrieve data from server. Please check internet connection and try again.");
                });
            },
            watch: {
                currentJob: function() {
                    if (this.currentJob.store != null && this.currentJob.store != undefined && _.includes(this.currentJob.store.store_front_url_abs, 'missing')) {
                        this.currentJob.store.store_front_url_abs = this.property.default_logo_url;
                    }
                    else if (this.currentJob.store == null && this.currentJob.store == undefined) {
                        this.currentJob.store = {};
                        this.currentJob.store.store_front_url_abs =  this.property.default_logo_url;
                    }
                    if(this.currentJob.image_url != null && this.currentJob.image_url != undefined && _.includes(this.currentJob.image_url, 'missing')){
                        this.currentJob.image_url = this.currentJob.store.store_front_url_abs;
                    }
                    var vm = this;
                    var temp_promo = [];
                    var current_id = _.toNumber(this.currentJob.id);
                    var job_id = this.currentJob.jobable_id;
                    _.forEach(this.allJobs, function(value, key) {
                        if (_.toNumber(value.id) != current_id && _.toNumber(value.jobable_id) == job_id) {
                            var current_promo = vm.findJobById(value.id);
                            current_promo.description_short = _.truncate(current_promo.description, {
                                'length': 70
                            });
                            temp_promo.push(current_promo);
                        }
                    });

                    this.storeJobs = temp_promo;
                },
                $route : function () {
                    this.updateCurrentJob(this.$route.params.id);
                }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedJobs',
                    'findJobBySlug',
                    'findJobById'
                ]),
                allJobs() {
                    var jobs = this.processedJobs;
                    jobs.map(job => {
                        if (job.store != null && job.store != undefined && _.includes(job.store.store_front_url_abs, 'missing')) {
                            job.store.store_front_url_abs =  vm.property.default_logo_url;
                        }
                        else if (job.store == null && job.store == undefined) {
                            job.store = {};
                            job.store.store_front_url_abs =  vm.property.default_logo_url;
                        }
                    });
                    return jobs;
                },
            },
            methods: {
                updateCurrentJob (id) {
                    this.currentJob = this.findJobBySlug(id);
                    if (this.currentJob === null || this.currentJob === undefined){
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
                    var share_url = "http://www.shopcanyoncrest.com/jobs/" + slug;
                    return share_url;
                }
            }
        });
    });
</script>
