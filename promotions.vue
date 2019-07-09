<template>
    <div class="main_container" v-if="dataloaded"> <!-- without an outer container this component template will not render -->
        <div id="promotions_container" class="margin_25_across">
            <h1 class="inside_heading">Upcoming Promotions!</h1>
            <p class="exclusive_deals sub_title">Don’t miss our exclusive deals!</p>
            <div class="row" v-if="promotions.length > 0">
                <div class="col-sm-4" v-for="promo in promotions">
                    <hr class="show_phone">
                    <div class="promo_list_container text_center">
                        <div class="promo_list_img_container">
                            <img :src="promo.store.store_front_url_abs" class="promo_list_img">
                        </div>
                        <p class="description_text">{{ promo.name }}</p>
                        <p class="top_promo_date" v-if="isMultiDay(promo)">
                            {{promo.start_date | moment("MMM D", timezone)}} - {{promo.end_date | moment("MMM D", timezone)}}
                        </p>
                        <p class="top_promo_date" v-else>{{ promo.start_date | moment("MMM D", timezone)}}</p>
                        <router-link :to="{ name: 'promotionDetails', params: { id: promo.slug }}" class="animated_btn text_center">Read More</router-link>
                    </div>
                </div>
            </div>
            <div class="row" v-else>
                <div class="col-sm-12">
                    <p>There are currently no Promotions posted. Please check back soon!</p>
                </div>
            </div>
        </div>
        <div class="padding_top_40"></div>
    </div>
</template>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment"], function(Vue, Vuex, moment, tz, VueMoment) {
        return Vue.component("promos-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    dataloaded: false
                }
            },
            created () {
                this.$store.dispatch("getData", "promotions").then(response => {
                    this.dataloaded = true;
                }, error => {
                    console.error("Could not retrieve data from server. Please check internet connection and try again.");
                });    
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedPromos',
                ]),
                promotions() {
                    var vm = this;
                    var temp_promo = [];
                    _.forEach(this.processedPromos, function(value, key) {
                        today = moment().tz(vm.timezone);
                        webDate = moment(value.show_on_web_date).tz(vm.timezone);
                        if (today.format() >= webDate.format()) {
                            value.description_short = _.truncate(value.description, {
                                'length': 150
                            });
                            value.description_short_2 = _.truncate(value.description_2, {
                                'length': 150
                            });
                            if (value.store != null && value.store != undefined && _.includes(value.store.store_front_url_abs, 'missing')) {
                                value.store.store_front_url_abs = vm.operty.default_logo_url;
                            } else if (value.store == null || value.store == undefined) {
                                value.store = {};
                                value.store.store_front_url_abs =  vm.property.default_logo_url;
                            }
                            temp_promo.push(value);
                        }
                    });
                    _.sortBy(temp_promo, [function(o) { return o.start_date; }]);
                    return temp_promo;
                },
            },
            methods: {
                isMultiDay(currentPromo) {
					var timezone = this.timezone
					var start_date = moment(currentPromo.start_date).tz(timezone).format("MM-DD-YYYY")
					var end_date = moment(currentPromo.end_date).tz(timezone).format("MM-DD-YYYY")
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