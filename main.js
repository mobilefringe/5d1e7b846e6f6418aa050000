require.config({
    paths: {
        'Vue': 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.4.1/vue.min',
        'vue_router': 'https://cdnjs.cloudflare.com/ajax/libs/vue-router/2.7.0/vue-router.min',
        'axios': 'https://cdnjs.cloudflare.com/ajax/libs/axios/0.16.1/axios.min',
        'jquery': 'https://code.jquery.com/jquery-3.2.1.min',
        'lodash': 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min',
        'moment': 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min',
        'moment-timezone': 'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.14/moment-timezone-with-data-2012-2022.min',
        'vue2-filters': 'https://cdn.jsdelivr.net/vue2-filters/0.1.8/vue2-filters.min',
        'vue': 'https://mmvue.codecloudapp.com/require-vuejs.min',
        'vuex': 'https://cdnjs.cloudflare.com/ajax/libs/vuex/2.3.1/vuex.min',
        'vue-i18n': 'https://cdnjs.cloudflare.com/ajax/libs/vue-i18n/6.1.1/vue-i18n.min',
        'text': 'https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min',
        'json': 'https://unpkg.com/requirejs-plugins-current@1.0.3/src/json',
        'js-cookie': 'https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.4/js.cookie.min',
        'vue-meta': 'https://unpkg.com/vue-meta@1.0.4/lib/vue-meta.min',
        'Fuse': 'https://cdnjs.cloudflare.com/ajax/libs/fuse.js/3.0.4/fuse.min',
        'datastore_mutation_types': 'https://mmvue.codecloudapp.com/datastore_mutation_types',
        'datastore_getters': 'https://mmvue.codecloudapp.com/datastore_getters',
        'datastore_actions': 'https://mmvue.codecloudapp.com/datastore_actions',
        'datastore_mutations': 'https://mmvue.codecloudapp.com/datastore_mutations',
        'datastore': 'https://mmvue.codecloudapp.com/datastore',
        'vue-moment': 'https://mmvue.codecloudapp.com/vue-moment',
        'today_hours': 'https://mmvue.codecloudapp.com/today_hours.vue?noext', //append a dummy query string so requireJS doesn't auto-append .js to the end of the url
        'search-component': 'https://mmvue.codecloudapp.com/search-component.vue?noext',
        'slick': 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min',
        'vue-slick': 'https://mmvue.codecloudapp.com/slick.vue?noext',
        'vue-select': 'https://cdn.jsdelivr.net/npm/vue-select@2.3.0/dist/vue-select.min',
        'vue-social-sharing': 'https://cdn.jsdelivr.net/npm/vue-social-sharing@2.3.1/dist/vue-social-sharing.min',
        'vee-validate': 'https://cdn.jsdelivr.net/npm/vee-validate@latest/dist/vee-validate',
        'vue-fullcalendar': 'https://5a1f136e6e6f6472c6240000.codecloudapp.com/vue-fullcalendar',
        'vue-simple-spinner': 'https://cdn.jsdelivr.net/npm/vue-simple-spinner@1.2.8/dist/vue-simple-spinner.min',
        'vue-lazy-load': 'https://unpkg.com/vue-lazyload/vue-lazyload',
        'loader': 'https://mmvue.codecloudapp.com/loader.vue?noext',
        'mousewheel' : 'https://cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min',
        'mapplic' : 'https://preview-mmvue.codecloudapp.com/mapplic',
        'hammer' : 'https://codecloud.cdn.speedyrails.net/sites/59bac7db6e6f644f22ba0000/text/javascript/1484859750000/hammer.min',
        'mapplic-map' : 'https://preview-mmvue.codecloudapp.com/mapplic.vue?noext',
        'campaignMonitor': 'https://js.createsend1.com/javascript/copypastesubscribeformlogic',
    }
});

require(['Vue', 'vuex', 'vue2-filters', 'vue_router', 'routes', 'datastore', 'vue-i18n', 'locales', 'moment', 'vue-meta', "moment-timezone", "vue-moment", 'vue-social-sharing', 'vue-select', "vue!search-component", 'vue-fullcalendar','vue-simple-spinner','vue!loader.vue'], function(Vue, Vuex, Vue2Filters, VueRouter, appRoutes, store, VueI18n, messages, moment, Meta, tz, VueMoment, SocialSharing, VueSelect, SearchComponent, FullCalendar, Spinner, Loader) {
    Vue.use(Meta);
    Vue.use(VueRouter);
    Vue.use(Vue2Filters);
    Vue.use(VueI18n);
    Vue.use(SocialSharing);

    /* initialize router */
    const router = new VueRouter({
        mode: 'history',
        routes: appRoutes,
        scrollBehavior(to, from, savedPosition) {
            return {
                x: 0,
                y: 0
            }
        }
    });

    /* initialize i18n */
    const i18n = new VueI18n({
        locale: 'en-ca',
        fallbackLocale: 'en-ca',
        messages,
    });

    Vue.component('v-select', VueSelect.VueSelect);
    Vue.component('full-calendar', FullCalendar)
    /* bootstrap app */
    const vm = new Vue({
        el: '#app',
        data: function() {
            return {
                dataLoaded: false,
                show_mobile_menu: false,
                show_subscrption: false,
                show_map: false,
                is_searching: false,
                show_mobile_search: false,
                mobile_search: null,
                desktop_search: null,
                suggestionAttribute: 'name',
                stickyMenu: false,
                isSticky: 225,
                navbar: null,
                menu_items: [
                    // {
                    //     name: "Home",
                    //     id: "home_link",
                    //     href: "/",
                    //     parent_id: "home"
                    // },
                    {
                        name: "Store Directory",
                        id: "stores_link",
                        href: "/stores"
                    },
                    {
                        name: "Sales & Promos",
                        id: "sales_link",
                        href: "/promotions"
                    },
                    {
                        name: "Events",
                        id: "events_link",
                        href: "/events",
                    },
                    // {
                    //     name: "Magazine",
                    //     id: "magazine_link",
                    //     href: this.magazine_url,
                    // },
                    {
                        name: "Contact Us",
                        id: "hours_link",
                        href: "/contact_us",
                    }
                ]
            }
        },
        created() {
            this.loadData().then(response => {
                this.dataLoaded = true;
                this.property.default_logo_url = "//codecloud.cdn.speedyrails.net/sites/5a1f136e6e6f6472c6240000/image/jpeg/1515531874445/canyon_crest_default.jpg";
            });
            window.addEventListener('scroll', this.enableStickyNavbar);
        },
        watch: {
            // watcher to update vue-i18n when the locale has been changed by the user
            locale: function(val, oldVal) {
                this.$i18n.locale = val;
                moment.locale(val);
            },
            $route: function() {
                if (this.$route.path == "/" || this.$route.path == "/stores") {
                    this.show_subscrption = false;
                } else {
                    this.show_subscrption = true;

                }
                if (this.$route.path == "/hours") {
                    this.show_map = true;
                } else {
                    this.show_map = false;
                }
                this.show_mobile_menu = false; //close menu when navigating to new page
            }
        },
        computed: {
            // computed property for locale which returns locale value from data store and also updates the data store with new locale information
            locale: {
                get() {
                    return this.$store.state.locale
                },
                set(value) {
                    this.$store.commit('SET_LOCALE', {
                        lang: value
                    })
                }
            },
            getBanners() {
                return this.$store.state.results.banners;
            },
            copyright_year() {
                return moment().year();
            },
            ...Vuex.mapGetters([
                'property',
                'timezone',
                'getTodayHours',
                'processedStores',
                'findRepoByName'
            ]),
            todays_hours() {
                return this.getTodayHours;
            },
            allStores() {
                return this.processedStores;
            },
            // magazine_url() {
            //     if( this.$store.state.repos) {
            //         var temp_repo = this.findRepoByName('Magazine PDFs');
            //         if(temp_repo && temp_repo.images) {
            //             return temp_repo.images[0];
            //         }
            //     }
            // }
        },
        methods: {
            loadData: async function() {
                try {
                    await this.$store.dispatch('initializeApi', { site: "kanata", version: "v4" });
                    await Promise.all([this.$store.dispatch("getData", "property")]);
                    this.property.mm_host = this.property.mm_host.replace("http:", "");
                    let results = await Promise.all([
                        this.$store.dispatch("INITIALIZE_LOCALE"), 
                        this.$store.dispatch("getData", "hours"), 
                        this.$store.dispatch("getData", "stores"), 
                        this.$store.dispatch("getData", "repos")
                    ]);
                    // await Promise.all([this.$store.dispatch("LOAD_META_DATA")]);
                } catch (e) {
                    console.log("Error loading data: " + e.message);
                }
            },
            // utility method to allow user to change locale value
            changeLocale: function(val) {
                this.locale = val; // this will update the data store, which in turn will trigger the watcher to update the locale in the system
            },
            onOptionSelect(option) {
                this.$nextTick(function() {
                    //clear search when changing routes
                    this.show_mobile_search = false;
                    this.is_searching = false;
                    this.mobile_search = "";
                    this.desktop_search = "";
                });
                this.$router.push("/stores/" + option.slug);
            },
            currentlySearching(value) {
                if (_.size(value) > 0) {
                    this.is_searching = true;
                } else {
                    this.is_searching = false;
                }
            },
            enableStickyNavbar(e) {
                if (window.pageYOffset >= this.isSticky) {
                    this.stickyMenu = true;
                } else {
                    this.stickyMenu = false;
                }
            }
        },
        destroyed: function() {
            window.removeEventListener('scroll', this.enableStickyNavbar);
        },
        router: router,
        store,
        i18n
    });
});