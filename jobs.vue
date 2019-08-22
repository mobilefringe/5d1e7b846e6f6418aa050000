<template>
    <div class="main_container" v-if="dataloaded"> <!-- without an outer container this component template will not render -->
        <div id="promotions_container" class="margin_25_across">
            <h1 class="inside_heading">Start Your Career at {{ property.name}}!</h1>
            <h2 class="inside_subheading">Join our family of dedicated professionals!</h2>
            <div class="row" v-if="allJobs.length > 0">
                <div class="col-sm-6 col-md-4" v-for="(item, index) in allJobs">
                    <hr class="show_phone">
                    <div class="promo_list_container text_center">
                        <div class="promo_list_img_container">
                            <img :src="item.store.store_front_url_abs" class="promo_list_img" alt="">
                        </div>
                        <h3 class="description_text">{{ item.name }}</h3>
                        <p class="top_temp_event_date" v-if="isMultiDay(item)">
                            {{item.start_date | moment("MMMM D", timezone)}} - {{item.end_date | moment("MMMM D", timezone)}}
                        </p>
                        <p class="top_promo_date" v-else>{{ item.start_date | moment("MMMM D", timezone)}}</p>
                        <router-link :to="{ name: 'eventDetails', params: { id: item.slug }}" class="animated_btn text_center">View Event Details</router-link>
                    </div>
                </div>
            </div>
            <div class="row" v-else>
                <div class="col-sm-12">
                    <p>There are currently no Events scheduled. Please check back soon!</p>
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
                    dataloaded: false
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
