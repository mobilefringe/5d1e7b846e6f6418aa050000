<template>
    <div class="main_container" v-if="dataloaded"> <!-- without an outer container this component template will not render -->
        <div id="promotions_container" class="margin_25_across">
            <h1 class="inside_heading">Exclusive Events at {{ property.name}}!</h1>
            <h2 class="inside_subheading">Join us to celebrate and enjoy!</h2>
            <div class="row">
                <div class="col-sm-6 col-md-4" v-for="(item, index) in news">
                    <hr class="show_phone">
                    <div class="promo_list_container text_center">
                        <div class="promo_list_img_container">
                            <img :src="item.store.store_front_url_abs" class="promo_list_img" :alt="property.name + ' Logo">
                        </div>
                        <h3 class="description_text">{{ item.name }}</h3>
                        <p class="top_temp_event_date" v-if="isMultiDay(item)">
                            {{ item.start_date | moment("MMMM D", timezone)}} - {{ item.end_date | moment("MMMM D", timezone)}}
                        </p>
                        <p class="top_promo_date" v-else>{{ item.start_date | moment("MMMM D", timezone)}}</p>
                        <router-link :to="{ name: 'newsDetails', params: { id: item.slug }}" class="animated_btn text_center">View Details</router-link>
                    </div>
                </div>
            </div>
            <div class="row" v-else>
                <div class="col-sm-12">
                    <p>There are currently no News postings scheduled. Please check back soon!</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment"], function(Vue, Vuex, moment, tz, VueMoment) {
        return Vue.component("news-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    dataloaded: false
                }
            },
            created () {
                this.$store.dispatch("getData", "news").then(response => {
                    this.dataloaded = true;
                    console.log("hi")
                    
                    this.news
                }, error => {
                    console.error("Could not retrieve data from server. Please check internet connection and try again.");
                });    
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedNews'
                ]),
                news() {
                    console.log("news", this.processedNews)
                    var vm = this;
                    var temp_event = [];
                    _.forEach(this.processedNews, function(value, key) {
                        today = moment().tz(vm.timezone);
                        webDate = moment(value.show_on_web_date).tz(vm.timezone);
                        if (today.format() >= webDate.format()) {
                            value.description_short = _.truncate(value.description, { 'length': 150 });

                            if (value.store != null && value.store != undefined && _.includes(value.store.store_front_url_abs, 'missing')) {
                                value.store.store_front_url_abs = vm.property.default_logo_url;
                            } else if (value.store == null || value.store == undefined) {
                                value.store = {};
                                value.store.store_front_url_abs =  vm.property.default_logo_url;
                            }
                            
                            temp_event.push(value);
                        }
                    });
                    temp_event = _.sortBy(temp_event, [function(o) { return o.event_date; }]);
                    return temp_event;
                }
            },
            methods: {
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