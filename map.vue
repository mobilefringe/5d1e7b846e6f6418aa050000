<template>
    <div class="main_container"> <!-- for some reason if you do not put an outer container div this component template will not render -->
        <div class="margin_25_across padding_top_40">
            <div class="row">
                <div class="col-md-12">
                    <h1 class="inside_heading">{{ property.name }} Map</h1>
                </div>
            </div>
                <div class="select_container show_phone">
                    <v-select :options="allStores" :placeholder="'Select A Store'" :searchable="false" :label="'name'" :on-change="dropPin" id="mobile_alpha_list"></v-select> 
                </div>
            <div class="row">
                <div class="col-sm-12">
                    <div class="map_container">
                        <div class="map_storelist hidden_phone">
                            <v-select :options="allStores" :placeholder="'Select A Store'" :searchable="false" :label="'name'" :on-change="dropPin"></v-select>                         </div>
                    </div>
                    <div>
                        <mapplic-map ref="mapplic_ref" :height="700" :minimap= "false" :deeplinking="false" :sidebar="false" :hovertip="true" :maxscale= "5" :storelist="allStores" :floorlist="floorList" :svgWidth="2000" :svgHeight="2000" tooltiplabel="Info" :svgId="'Layer_1'"></mapplic-map>
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
    define(["Vue","vuex", "vue!mapplic-map"], function(Vue, Vuex, MapplicComponent) {
        return Vue.component("map-component", {
            template: template, // the variable template will be injected
            methods: {
                dropPin(store) {
                    this.$refs.mapplic_ref.showLocation(store.svgmap_region);
                }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedStores'
                ]),
                allStores() {
                    return this.processedStores;
                },
                getSVGurl () {
                    console.log("this.property.svgmap_url", this.property.svgmap_url)
                    return "https://www.mallmaverick.com" + this.property.svgmap_url; //"https://www.mallmaverick.com/system/site_images/photos/000/037/217/original/Canyon_Crest_-_Map_-_Mar-02-2018_-_Presentation_Attributes.svg";//"https://www.mallmaverick.com" + this.property.svgmap_url.split("?")[0];
                },
                regions () {
                    var regions = {}
                    _.forEach( this.processedStores , function( val, key ) {
                        if(val.svgmap_region != null && typeof(val.svgmap_region)  != 'undefined'){
                            if(!val.store_front_url_abs ||  val.store_front_url_abs.indexOf('missing.png') > -1 || val.store_front_url_abs.length === 0){
                                val.store_front_url_abs = '//codecloud.cdn.speedyrails.net/sites/55ddf3f86e6f640775000000/a22fcf023d728855c6f575ba100806d7/default.jpg';
                            }
                            obj = {};
                            obj["tooltip"] = "<p class='tooltip_name'>"+val.name+"</p>";
                            obj["attr"] = {};
                            obj["attr"]["href"] = "/stores/"+val.slug;
                            regions[val.svgmap_region] = obj;
                        }
                    });
                    return regions;
                },
                floorList () {
                    var floor_list = [];
                    
                    var floor_1 = {};
                    floor_1.id = "first-floor";
                    floor_1.title = "Level One";
                    floor_1.map = this.getSVGurl;
                    floor_1.z_index = 1;
                    floor_1.show = true;
                    floor_list.push(floor_1);
                    return floor_list;
                }
            }
        });
    });
</script>
