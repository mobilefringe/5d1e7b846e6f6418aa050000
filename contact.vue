<template>
    <div class="main_container" v-if="dataLoaded"> <!-- without an outer container div this component template will not render -->
        <div class="margin_25_across">
            <div class="row">
                <div class="col-md-12">
                    <h1 class="inside_heading">Get In Touch</h1>
                    <h2 class="inside_subheading">Stay up-to-date with all our latest happenings!</h2>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div v-if="currentPage" v-html="currentPage.body"></div>
                </div>
                <div class="col-md-6 hidden_phone">
                    <img v-if="pageImage" :src="pageImage.image_url" alt="" />
                </div>
            </div>
            <div class="row padding_top_40"> 
                <div class="col-md-12">
                    <hr />
                </div>
            </div>
            <div class="row padding_top_40"> 
                <div class="col-md-12">
                    <form id="contact_form" action="form-submit" @submit.prevent="validateBeforeSubmit">
                        <div class="row form-group">
                            <div class="col-md-6" :class="{'has-error': errors.has('name')}">
                                <label class="label" for="name">Name</label>
                                <input id="name" v-model="form_data.name" v-validate="'required|alpha_spaces'" class="form-control" :class="{'input': true}" name="name" type="text" placeholder="Name" data-vv-delay="1000">
                                <span v-show="errors.has('name')" class="form-control-feedback">{{ errors.first('name') }}</span>
                            </div>
                            <div class="col-md-6" :class="{'has-error': errors.has('email')}">
                                <label class="label" for="email">Email</label>
                                <input id="email" v-model="form_data.email" v-validate="'required|email'" class="form-control" :class="{'input': true}" name="email" type="email" placeholder="Email" data-vv-delay="1000">
                                <span v-show="errors.has('email')" class="form-control-feedback">{{ errors.first('email') }}</span>
                            </div>
                        </div>
                        <div class="row form-group">
                            <div class="col-md-12" :class="{'has-error': errors.has('subject')}">
                                <label class="label" for="subject">Subject</label>
                                <input id="subject" v-model="form_data.subject" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="subject" type="text" placeholder="Subject" data-vv-delay="1000">
                                <span v-show="errors.has('subject')" class="form-control-feedback">{{ errors.first('subject') }}</span>
                            </div>
                        </div>
                        <div class="row form-group">
                            <div class="col-md-12" :class="{'has-error': errors.has('message')}">
                                <label class="label" for="message">Message</label>
                                 <textarea id="message" v-model="form_data.message" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="message" type="text" placeholder="Message" data-vv-delay="500"></textarea>
                                <span v-show="errors.has('message')" class="form-control-feedback">{{ errors.first('message') }}</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12 text-center">
                                <button class="animated_btn" type="submit" :disabled="formSuccess">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="col-md-12">
                    <div class="padding_top_20" v-show="formSuccess">
                        <div id="send_contact_success" class="alert alert-success" role="alert">
                            <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                            <span class="sr-only">Success</span>
                            Thank you for contacting us. A member from our team will contact you shortly.
                        </div>
                    </div>
                    <div class="padding_top_20" v-show="formError">
                        <div id="send_contact_error" class="alert alert-danger" role="alert">
                            <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                            <span class="sr-only">Error:</span>
                            There was an error when trying to submit your request. Please try again later.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "vee-validate"], function(Vue, Vuex, moment, tz, VueMoment, VeeValidate) {
        Vue.use(VeeValidate);
        return Vue.component("contact-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    dataLoaded: false,
                    currentPage: {},
                    pageImage: null,
                    form_data : {},
                    formSuccess : false,
                    formError: false
                }
            },
            created () {
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Contact Us Image').images;
                    if (temp_repo != null && temp_repo != undefined) {
                        this.pageImage = temp_repo[0];
                    } else {
                        this.pageBanner = "";
                    }
                    
                    this.currentPage = response[1].data;
                    
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findRepoByName'
                ])
            },
            methods: {
                loadData: async function() {
                    try {
                        let results = await Promise.all([
                            this.$store.dispatch("getData", "repos"),
                            this.$store.dispatch('LOAD_PAGE_DATA', { url: this.property.mm_host + "/pages/kanata-contact-us.json" })
                        ]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                validateBeforeSubmit() {
                    this.$validator.validateAll().then((result) => {
                        if (result) {
                            
                            let errors = this.errors;
                            send_data = {};
                            send_data.form_data = JSON.stringify(this.serializeObject(this.form_data));
                            this.$store.dispatch("CONTACT_US", send_data).then(res => {
                                this.formSuccess = true;
                            }).catch(error => {
                                try {
                                    if (error.response.status == 401) {
                                        console.log("Data load error: " + error.message);
                                        this.formError = true;
                                    } else {
                                        console.log("Data load error: " + error.message);
                                        this.formError = true;
                                    }
                                } catch (e) {
                                    console.log("Data load error: " + error.message);
                                    this.formError = true;
                                }
                            })
                        }
                    })
                },
                serializeObject (obj) {
                    var newObj = [];
                    _.forEach(obj, function(value, key) {
                        var tempVal = {};
                        tempVal.name = key;
                        tempVal.value = value;
                        newObj.push(tempVal);
                    });
                    return newObj;
                }
            }
        });
    });
</script>
