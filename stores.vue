<template>
    <div class="main_container">

        <div class="margin_25_across">
            <div class="row hidden_phone">
                <div class="col-md-12">
                    <h1 class="inside_heading">Store Directory</h1>
                    <h2 class="inside_subheading">Explore • Enjoy • Shop</h2>
                </div>
				<div class="col-sm-6 col-md-4">
					<div class="store_search" id="storeSearch">
						<search-component :list="allStores" placeholder="Find Your Store" suggestion-attribute="name" v-model="search_result" @select="onOptionSelect" class="text-left" :keys="['name']" :tokenize="true">
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
							<v-select v-model="selectedCat" :options="dropDownCats" :searchable="false" :on-change="filterByCategory" class="category-select" placeholder="Sort by Category" id="selectByCat"></v-select>
						</div>
					</div>
				</div>
				<div class="col-md-4 col-sm-12 hidden_phone">
					<div class="store_search" >
						<router-link class="directory_link" to="/map">
							<div class="promotions_header_container directory_btn">Centre Map</div>
						</router-link>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12" id="store_list_container">
				    <store-masonry :filteredStores="filteredStores"></store-masonry>
				</div>
			</div>
        </div>
    </div>
</template>
<script>
    define(["Vue", "vuex", "vue-select", "vue!search-component", "vue!store-masonry"], function(Vue, Vuex, VueSelect, SearchComponent, StoreMasonry) {
        return Vue.component("stores-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    selectedCat: null,
                    filteredStores: null,
                    dataloaded: false,
                    search_result : null,
                }
            },
            created (){
                this.loadData().then(response => {
                    this.dataloaded = true;
                    this.filteredStores = this.allStores;
                });
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
                onOptionSelect(option) {
                    this.search_result = "";
                    this.$router.push("/stores/"+option.slug);
                }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedStores',
                    'processedCategories',
                    'storesByAlphaIndex',
                    'storesByCategoryName',
                    'findCategoryById',
                    'findCategoryByName',
                    'findRepoByName'
                ]),
                allStores() {
                    var stores = this.processedStores;
                    stores.map(store => {
                        if (_.includes(store.store_front_url_abs, 'missing')) {
                           store.no_store_logo = true;
                        } else {
                          store.no_store_logo = false;
                        }
                    });
                    return this.processedStores;
                },
                allCatergories() {
                    return this.processedCategories;
                },
                dropDownCats() {
                    var cats = _.map(this.processedCategories, 'name');
                    cats.unshift('All');
                    return cats;
                },
                filterStores() {
                    letter = this.selectedAlpha;
                    if (letter == "All") {
                        this.filteredStores = this.allStores;
                    } else {
                        var filtered = _.filter(this.allStores, function(o, i) {
                            return _.lowerCase(o.name)[0] == _.lowerCase(letter);
                        });
                        this.filteredStores = filtered;
                    }
                },
                filterByCategory() {
                    category_id = this.selectedCat;
                    if (category_id == "All" || category_id == null || category_id == undefined) {
                        category_id = "All";
                    } else {
                        category_id = this.findCategoryByName(category_id).id;
                    }

                    if (category_id == "All") {
                        this.filteredStores = this.allStores;
                    } else {

                        var find = this.findCategoryById;
                        var filtered = _.filter(this.allStores, function(o) {
                            return _.indexOf(o.categories, _.toNumber(category_id)) > -1;
                        });
                    
                        this.filteredStores = filtered;
                    }
                    var el = document.getElementById("selectByCat");
                    if(el) {
                        el.classList.remove("open");
                    }
                }
            }
        });
    });
</script>