<template>
    <div class="main_container"> <!-- without an outer container div this component template will not render -->
        <div class="margin_25_across">
            <div class="row">
                <div class="col-md-12">
                    <h1 class="inside_heading">{{ property.name }} Map</h1>
                    <h2 class="inside_subheading">Join us to celebrate and enjoy!</h2>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12">
                    <div class="select_container show_phone">
                        <v-select :options="mapStores" :placeholder="'Select A Store'" :searchable="false" :label="'name'" :on-change="dropPin" id="mobile_alpha_list"></v-select> 
                    </div>
                    <div class="map_container">
                        <div class="map_storelist hidden_phone">
                        <v-select :options="mapStores" :placeholder="'Select A Store'" :searchable="false" :label="'name'" :on-change="dropPin"></v-select>                         </div>
                    </div>
                    <div>
                        <mapplic-map ref="mapplic_ref" :height="700" :minimap= "false" :deeplinking="false" :sidebar="false" :hovertip="true" :maxscale= "5" :storelist="mapStores" :floorlist="floorList" :svgWidth="2000" :svgHeight="2000" tooltiplabel="Info" :svgId="'Layer_1'"></mapplic-map>
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
  .store-section a {
    color: #708090;
  }
</style>

<script>
    define(["Vue", "vuex", "vue-select", "vue!mapplic-map"], function(Vue, Vuex, VueSelect, MapplicComponent) {
        return Vue.component("stores-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    listMode: "alphabetical",
                    selectedCat: null,
                    selectedAlpha: "All",
                    
                    filteredStores: null,
                    dataloaded: false,
                    mobile_store: false,
                    windowWidth: 0,
                    storeBanner : null,
                    search_result : null,
                }
            },
            created (){
                this.loadData().then(response => {
                    this.dataloaded = true;
                });
            },
            watch: {
                windowWidth: function() {
                    if (this.windowWidth <= 768) {
                        this.mobile_store = true;
                    } else {
                        this.mobile_store = false;
                    }
                }
            },
            mounted() {
                this.$nextTick(function() {
                    window.addEventListener('resize', this.getWindowWidth);
                    //Init
                    this.getWindowWidth();
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedStores'
                ]),
                getSVGMap(){
                  return "//mallmaverick.com" + this.property.svgmap_url;  
                },
                floorList () {
                    var floor_list = [];
                    var floor_1 = {};
                    floor_1.id = "first-floor";
                    floor_1.title = "Level One";
                    floor_1.map = this.getSVGMap;
                    floor_1.z_index = null;
                    floor_1.show = true;
                    floor_list.push(floor_1);
                    
                    return floor_list;
                },
                mapStores() {
                    var all_stores = this.processedStores;
                    _.forEach(all_stores, function(value, key) {
                        value.zoom = 2;
                        if (value.svgmap_region == null) {
                            value.svgmap_region = value.id;
                        }
                    });
                    return all_stores;
                }
            },
            methods: {
                loadData: async function() {
                    try {
                        let results = await Promise.all([
                            this.$store.dispatch("getData", "categories"), 
                            this.$store.dispatch("getData", "repos")
                        ]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                dropPin(store) {
                    this.$refs.mapplic_ref.showLocation(store.svgmap_region);
                },
                getWindowWidth(event) {
                    this.windowWidth = window.innerWidth;
                },
                onOptionSelect(option) {
                    this.search_result = "";
                    this.dropPin(option);
                }
            },
            beforeDestroy: function() {
                window.removeEventListener('resize', this.getWindowWidth);
            }
        });
    });
</script>
