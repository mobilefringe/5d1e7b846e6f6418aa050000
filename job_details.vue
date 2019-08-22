<template>
    <div class="main_container" v-if="currentJob">
        <h1 class="accessibility">{{ property.name }} Events</h1>
        <div class="margin_25_across">
            <div class="promo_main_header sub_title">
                <span class="promo_back all_caps"><i class="fa fa-caret-left"></i>&nbsp;<router-link to="/jobs">Back to Careers</router-link></span>
            </div>

            <div class="row" id="promo_details_container">
                <div class="col-md-4 col-sm-4">
                    <img v-if="currentJob.store.image_url" :src="currentJob.store.image_url"  :alt="currentJob.store.name + ' Logo'" class="details_image" />
                </div>
                <div class="col-md-8 col-sm-8">
                    <p class="promo_dates sub_title">{{ currentJob.store.name | uppercase }}</p>
                    <h2 class="promo_list_name">{{currentJob.name}}</h2>
                    <p class="promo_dates sub_title" v-if="isMultiDay(currentJob)">
                        {{ currentJob.start_date | moment("MMMM D", timezone) }} - {{ currentJob.end_date | moment("MMMM D", timezone) }}
                    </p>
                    <p class="promo_dates sub_title" v-else>{{  currentJob.start_date | moment("MMMM D", timezone)}}</p>
                    <div class="store_details_desc" v-html="currentJob.rich_description"></div>
                    <social-sharing :url="shareURL(currentJob.slug)" :title="currentJob.name" :description="currentJob.description" :quote="truncate(currentJob.description)" :media="currentJob.image_url" inline-template>
                        <div class="blog-social-share">
                            <p class="all_caps">Share this Event</p>
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
</template>

<script>
    define(["Vue", "vuex","moment", "moment-timezone", "vue-moment"], function(Vue, Vuex, moment, tz, VueMoment) {
        return Vue.component("job-details-component", {
            template: template, // the variable template will be injected,
            props:['id'],
            data: function() {
                return {
                    currentJob: null
                }
            },
            created(){
                this.$store.dispatch("getData", "jobs").then(response => {
                    this.updateCurrentJob(this.id);
                }, error => {
                    console.error("Could not retrieve data from server. Please check internet connection and try again.");
                });
            },
            watch: {
                $route : function () {
                    this.updateCurrentJob(this.$route.params.id);
                },
                currentJob: function() {
                    if (this.currentJob.store !== null && this.currentJob.store !== undefined && _.includes(this.currentJob.store.store_front_url_abs, 'missing')) {
                        this.currentJob.store.store_front_url_abs =  this.property.default_logo_url;
                    } else if (this.currentJob.store == null && this.currentJob.store == undefined) {
                        this.currentJob.store = {};
                        this.currentJob.store.store_front_url_abs =  this.property.default_logo_url;
                    }
                    
                    // if (this.currentJob.image_url != null && this.currentJob.image_url != undefined && _.includes(this.currentJob.image_url, 'missing')){
                    //     this.currentJob.image_url =  this.property.default_logo_url;
                    // }
                }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedJobs',
                    'findJobBySlug'
                ])
            },
            methods: {
                updateCurrentJob (id) {
                    this.currentJob = this.findJobBySlug(id);
                    console.log("job", this.currentJob)
                    if (this.currentJob === null || this.currentJob === undefined){
                        // this.$router.replace('/');
                    }
                },
                isMultiDay(currentJob) {
					var timezone = this.timezone
					var start_date = moment(currentJob.start_date).tz(timezone).format("MM-DD-YYYY")
					var end_date = moment(currentJob.end_date).tz(timezone).format("MM-DD-YYYY")
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
                    var share_url = "https://kanatacentral.com/jobs/" + slug;
                    return share_url;
                }
            }
        });
    });
</script>
