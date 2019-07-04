<template>
    <div class="content_container  position_relative padding_top_20 storelist_container">
        <div class="shop_mobile_banner show_phone">
            <img src="//codecloud.cdn.speedyrails.net/sites/5a1f136e6e6f6472c6240000/image/png/1512663245990/shop_mobile_placeholder.png" alt="">
        </div>
        <div class="main_container">
            <div class="row hidden_phone">
                <div class="col-md-12">
                    <h2 class="stores_main_heading">Store Directory</h2>
                    <p class="store_main_desc sub_title">Explore • Enjoy • Shop</p>
                </div>
				<div class="col-sm-6 col-md-4">
					<div class="store_search" >
						<search-component :list="allStores" :placeholder="$t('stores_page.find_your_store')" suggestion-attribute="name" v-model="search_result" @select="onOptionSelect" class="text-left" :keys="['name']" :tokenize="true">
							<template slot="item" scope="option" class="manual">
								<article class="media">
									<p>
										<strong>{{ option.data.name }}</strong>
									</p>
								</article>
							</template>
						</search-component>
						<img src="//codecloud.cdn.speedyrails.net/sites/5a6a54eb6e6f647da51e0100/image/png/1517497861636/search_icon_2x.png" class="pull-right" id="store_search_img" alt="search icon">
					</div>
				</div>
				<div class="col-sm-6 col-md-4">
					<div class="store_search" >
						<div class="category-select-container">
							<v-select v-model="selectedCat" :options="dropDownCats" :searchable="false" :on-change="filterByCategory" class="category-select" :placeholder="$t('stores_page.sort_by_cats')" id="selectByCat"></v-select>
						</div>
					</div>
				</div>
				<div class="col-md-4 col-sm-12 hidden_phone">
					<div class="store_search" >
						<router-link class="directory_link" to="/map">
							<div class="promotions_header_container directory_btn">{{$t("stores_page.view_map")}}</div>
						</router-link>
					</div>
				</div>
			</div>
			<div class="row">
				<div id="store_list_container">
				    <store-masonry :filteredStores="filteredStores"></store-masonry>
				</div>
			</div>
            
            
            <div class="mobile_padding show_phone">
                <div class="select_container">
                    <v-select :options="allMobileCategories" :placeholder="'Select By Categoty'" :searchable="false" :on-change="filteredByCategory" id="mobile_cat_list"></v-select> 
                </div>
                <div class="select_container">
                    <v-select :options="mobileAlphabet" :placeholder="'Select Store A-Z'" :searchable="false" :on-change="filterStores" id="mobile_alpha_list"></v-select> 
                </div>
                
                
            </div>
            <div class="row padding_bottom_50 phone_padding_top_60">
                <div class="col-md-12">
                    <div class="alpha_list">
                        <a @click="filterStores('All')" class="all_a">All</a>
                        <a @click="filterStores('#')">#</a>
                        <a v-for="letter in alphabet" @click="filterStores(letter)">{{letter}}</a>
                    </div>
                </div>
                <div class="col-md-12">
                    <h5 class="category_header" style="display:none" id="cat_name_header">All</h5>
                    <div class="row" v-if="filteredStores">
                        <div class="col-md-12 store_col_1" :class="{ all_storelist_container: breakIntoCol }">
                            <div v-for="(stores,key) in filteredStores" style="padding:0 10px;">
                                <span class="store_initial" :data-initial="key">{{key}}</span>
                                <div id="store_list_container" class="store_list" v-for="store in stores">
                                    <div class="store_list_content cats_row" :data-cat="store.cat_list">
                                        <p class="store_name"><router-link :to="'/stores/'+store.slug">{{store.name}}</router-link></p>
                                        <!--<p class="store_name"><router-link :to="{ path: /stores/'+store.slug , query: { location: store.svgmap_region }}">{{store.name}}</router-link></p>-->
                                        
                                    </div>
                                </div>   
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
    define(["Vue","vuex", "vue!mapplic-map"], function(Vue, Vuex, MapplicComponent) {
        return Vue.component("stores-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    listMode: "alphabetical",
                    filteredStores: null,
                    mobileAlphabet : ['All',
                    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
                    ],
                    alphabet : [
                    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
                    ],
                    breakIntoCol : true
                }
            },
            created (){
                // window.Raphael = Raphael; // our mapSvg plugin is stupid and outdated. need this hack to tie Raphael to window object (global variable)
                this.$store.dispatch("getData", "categories");
            },
            mounted () {
                this.filteredStores = this.storesByAlphaIndex;
            },
            watch : {
                selected_cat : function () {
                    var cat_id = null;
                    if(this.selected_cat == "All" || this.selected_cat == null ||  this.selected_cat == undefined){
                        this.selected_cat = "All";
                        cat_id = "All";
                        this.breakIntoCol = true;
                    }
                    else {
                        cat_id= this.findCategoryByName(this.selected_cat).id;
                    }
                    this.filteredByCategory(cat_id);
                },
                selected_alpha : function () {
                    this.filterStores(this.selected_alpha);
                }
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
                dropPin(store) {
                    this.$refs.mapplic_ref.showLocation(store.svgmap_region);
                },
                filterStores (letter) {
                    
                    this.breakIntoCol = false;
                    if(letter == "All"){
                        this.filteredStores = this.storesByAlphaIndex;
                        this.breakIntoCol = true;
                    }
                    else {
                        var filtered = _.filter(this.storesByAlphaIndex, function(o,i) { return _.lowerCase(i) == _.lowerCase(letter); })[0];
                        this.filteredStores = _.groupBy(filtered, store => (isNaN(store.name.charAt(0)) ? store.name.charAt(0) : "#"));
                        this.breakIntoCol = false;
                    }
                    
                },
                filteredByCategory (category_id) {
                    if(category_id == "All" || category_id == null ||  category_id == undefined){
                        category_id = "All";
                    }
                    else {
                        category_id= this.findCategoryByName(category_id).id;
                    }
                    
                    this.breakIntoCol = false;
                    
                    if(category_id == "All"){
                        this.filteredStores = this.storesByAlphaIndex;
                        this.breakIntoCol = true;
                    }
                    else {
                        
                        var find = this.findCategoryById;
                        var filtered = _.filter(this.allStores, function(o) {return _.indexOf(o.categories, _.toNumber(category_id)) > -1; });
                        _.forEach(filtered, function(value, i) {
                            value.currentCategory = find(category_id).name;
                        });
                        sortedCats = _.groupBy(filtered, store => store.currentCategory);
                        this.filteredStores = sortedCats;
                    }
                    var position = $(".alpha_list").offset().top;
                    $('html, body').animate({
                		scrollTop: position
                	}, 500, 'linear');
                }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'repos',
                    'findRepoByName',
                    'processedStores',
                    'processedCategories',
                    'storesByAlphaIndex',
                    'storesByCategoryName',
                    'findCategoryById',
                    'findCategoryByName',
                ]),
                getSVGurl () {
                    return "https://www.mallmaverick.com" + this.property.svgmap_url;
                },
                allStores() {
                    return this.processedStores;
                },
                allCategories() {
                    return this.processedCategories;
                },
                allMobileCategories() {
                    var cats =_.map(this.processedCategories, 'name');
                    cats.unshift('All');
                    return cats;
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
