<template>
    <div class=" main_container" id="jobs_container"><!-- for some reason if you do not put an outer container div this component template will not render -->
        <h3 class="promotion_heading" v-if="property">Start your Career at {{property.name}}</h3>
        <p class="exclusive_deals sub_title">Join our family of dedicated professionals!</p>
        <div class="row" v-for="(jobs,store_name) in allJobs">
            <h2 class="store_details_promo_heading sub_title">
                    {{store_name}}
                </h2>
            <div id="promos_container">
                <div class="col-sm-6 no_padding" v-for="promo in jobs" :data-cat="promo.cat_list">
                    <div class="promo_item cats_row is-table-row" v-if="promo">
                        <div class="col-sm-5 col-xs-4 no_padding">
                            <img class="promo_store_image" v-if="promo.store" :src="promo.store.image_url" :alt="promo.name" />
                            <img class="promo_store_image" v-else src="//codecloud.cdn.speedyrails.net/sites/5a1f136e6e6f6472c6240000/image/jpeg/1515531874445/canyon_crest_default.jpg" :alt="promo.name" />
                        </div>
                        <div class="col-sm-7  padding_tb_20">
                            <router-link :to="'/jobs/'+promo.slug" class="">
                                <h2 class="promo_list_name">{{promo.name}}</h2>
                            </router-link>
                            <p>
                                <span class="promo_dates sub_title">{{promo.start_date | moment("MMM D", timezone)}} - {{promo.end_date | moment("MMM D", timezone)}}</span>
                            </p>
                            <div class="promo_list_desc hidden_phone">{{truncate(promo.description) }}</div>
                            <div class="text_center position_relative hidden_phone">
                                <router-link :to="'/jobs/'+promo.slug" class="animated_btn text_center">Read More</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>

<style>
  .center{
    text-align: center
  }
  .store-section a{
    color: #708090;
  }
</style>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "vue-meta"], function(Vue, Vuex, moment, tz, VueMoment, Meta) {
        Vue.use(Meta);
        return Vue.component("jobs-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    success_subscribe: false
                }
            },
            created () {
                this.$store.dispatch("getData", "jobs");
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedJobs'
                ]),
                allJobs() {
                    var jobs = this.processedJobs; //_.filter(this.$store.getters.processedJobs, function(o) { return o.store !=null && o.jobable_type === "Store" });
                    var vm = this;
                    jobs.map(job => {
                        if (job.store != null && job.store != undefined && _.includes(job.store.image_url, 'missing')) {
                            job.store.image_url = vm.property.default_logo_url;
                        }
                        else if (job.store == null && job.store == undefined) {
                            job.store = {};
                            job.store.store_front_url_abs =  vm.property.default_logo_url;
                        }
                    });
                    jobs = _.sortBy(jobs, [function(o) {
                        if (o.store) return o.store.name;
                    }]);
                    return _.groupBy(jobs, job => (isNaN(job.store) ? job.store.name : this.property.name));
                },
            },
            methods: {
                loadData: async function() {
                    try {
                        await this.$store.dispatch('initializeApi', {
                            site: "canyoncrest",
                            version: "v4"
                        });
                        // avoid making LOAD_META_DATA call for now as it will cause the entire Promise.all to fail since no meta data is set up.
                        let results = await Promise.all([this.$store.dispatch("INITIALIZE_LOCALE"), this.$store.dispatch("getData", "property"), this.$store.dispatch("getData", "hours"), this.$store.dispatch("getData", "stores")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                truncate(val_body) {
                    var truncate = _.truncate(val_body, {
                        'length': 75,
                        'separator': ' '
                    });
                    return truncate;
                }
            }
        });
    });
</script>
