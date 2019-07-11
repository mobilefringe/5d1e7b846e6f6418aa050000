<template>
    <div class="main_container" v-if="currentNews">
        <div class="margin_25_across">
            <div class="promo_main_header sub_title">
                <span class="promo_back all_caps"><i class="fa fa-caret-left"></i>&nbsp;<router-link to="/news">Back to News</router-link></span>
            </div>
        
            <div class="row mobile_padding" id="promo_details_container">
                <div class="col-md-4 col-sm-4">
                    <img :src="currentNews.image_url"  alt="Store Logo" class="details_image" />
                </div>
                <div class="col-md-8 col-sm-8" style="padding-bottom: 15px;">
                    <h2 class="promo_list_name">{{currentNews.name}}</h2>
                    <p class="promo_dates sub_title" v-if="isMultiDay(currentNews)">
                        {{ currentNews.start_date | moment("MMMM D", timezone) }} - {{ currentNews.end_date | moment("MMMM D", timezone) }}
                    </p>
                    <p class="promo_dates sub_title" v-else>{{  currentNews.start_date | moment("MMMM D", timezone)}}
                    <div class="store_details_desc" v-html="currentNews.rich_description"></div>
                </div>
            </div>
            <div class="padding_top_40"></div>
        </div>
    </div>
</template>

<script>
    define(["Vue", "vuex","moment", "moment-timezone", "vue-moment"], function(Vue, Vuex, moment, tz, VueMoment) {
        return Vue.component("news-details-component", {
            template: template, // the variable template will be injected,
            props:['id'],
            data: function() {
                return {
                    currentNews: null,
                }
            },
            watch: {
                $route : function () {
                    this.updateCurrentNews(this.$route.params.id);
                },
                currentNews: function() {
                    if (_.includes(this.currentNews.image_url, 'missing')) {
                        this.currentNews.image_url =  this.property.default_logo_url;
                    }
                }
            },
            mounted() {
                this.$store.dispatch("getData", "news").then(response => {
                    this.updateCurrentNews(this.id);
                }, error => {
                    console.error("Could not retrieve data from server. Please check internet connection and try again.");
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedNews',
                    'findNewsBySlug',
                    'findNewsById'
                ])
            },
            methods: {
                updateCurrentNews (id) {
                    this.currentNews = this.findNewsBySlug(id);
                    if (this.currentNews === null || this.currentNews === undefined){
                        this.$router.replace('/');
                    }
                },
                isMultiDay(currentNews) {
					var timezone = this.timezone
					var start_date = moment(currentNews.start_date).tz(timezone).format("MM-DD-YYYY")
					var end_date = moment(currentNews.end_date).tz(timezone).format("MM-DD-YYYY")
					if (start_date === end_date) {
						return false
					} else {
						return true
					}
				},
            }
        });
    });
</script>
