<template>
    <div class=" main_container" id="promotions_container"> <!-- for some reason if you do not put an outer container div this component template will not render -->
        <div class="margin_25_across padding_top_40">
            <div class="row">
                <div class="col-md-12">
                    <div id="send_contact_success" class="alert alert-success" role="alert" v-show="formSuccess">
                        <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                        <span class="sr-only">Success</span>
                        Thank you for subscribing to our newsletter.
                    </div>
                    <div id="send_contact_error" class="alert alert-danger" role="alert" v-show="formError">
                        <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                        <span class="sr-only">Error:</span>
                        There was an error when trying to submit your request. Please try again later.
                    </div>
                </div>
                <div class="col-sm-6 contact_contents">
                    <form class="form-horizontal js-cm-form" id="subForm" action="https://www.createsend.com/t/subscribeerror?description=" method="post" data-id="92D4C54F0FEC16E5ADC2B1904DE9ED1AC8067D17410EEBD96ACB1EAF7BA69804E172592B741A21816E434E8D5074574CD7177AEFE5E84B7E60459EF73A52B414" @submit.prevent="validateBeforeSubmit">
                        <div class="form-group ">
                            <div class="col-sm-12 col-xs-12" :class="{'has-error': errors.has('name')}">
                                <label class="label" for="name">Name</label>
                                <input v-model="form_data.name" v-validate="'required'" class="form-control" :class="{'input': true}" name="cm-name" type="text" placeholder="Name" data-vv-delay="1000">
                                <span v-show="errors.has('name')" class="form-control-feedback">{{ errors.first('name') }}</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-12 col-xs-12" :class="{'has-error': errors.has('email')}">
                                <label class="label" for="email">Email</label>
                                <input v-model="form_data.email" v-validate="'required|email'" class="form-control js-cm-email-input" :class="{'input': true}" name="cm-zlktyr-zlktyr" type="email" placeholder="Email" data-vv-delay="1000">
                                <span v-show="errors.has('email')" class="form-control-feedback">{{ errors.first('email') }}</span>
                            </div>
                        </div>
                        <div class="form-group account-btn text-left m-t-10">
                            <div class="col-xs-12">
                                <button class="animated_btn" type="submit" :disabled="formSuccess">Subscribe</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="col-sm-6 text-center">
                    <img src="//codecloud.cdn.speedyrails.net/sites/5a1f136e6e6f6472c6240000/image/png/1512580269422/placeholder_contact_image.png" alt="plaza">
                </div> 
            </div>
        </div>
    </div>
</template>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "vee-validate", "campaignMonitor"], function(Vue, Vuex, moment, tz, VueMoment, VeeValidate, campaignMonitor) {
        Vue.use(VeeValidate);
        return Vue.component("newsletter-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    currentPage: null,
                    form_data : {},
                    formSuccess : false,
                    formError: false
                }
            },
            mounted () {
                i f(this.$route.query.success == 'success') {
                    this.formSuccess = true;
                    this.$router.replace('/newsletter');
                }
            },
            watch : {
                $route () {
                    if(this.$route.query.success == 'success') {
                        this.formSuccess = true;
                        this.$router.replace('/newsletter');
                    }
                }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                ])
            },
            methods: {
                validateBeforeSubmit(form) {
                    this.$validator.validateAll().then((result) => {
                        if (result) {
                            let errors = this.errors;
                            
                            if(errors.length > 0) {
                                this.formError = true;
                            }
                            else {
                                form.preventDefault();
                                var vm = this;
                                $.getJSON(
                                    form.target.action ,
                                    $(form.target).serialize(),
                                    function (data) {
                                    if (data.Status === 400) {
                                        vm.formError = true;
                                    } else { // 200
                                        vm.formSuccess = true;
                                    }
                                });
                                form.preventDefault();
                            }
                        }
                    })
                }
            }
        });
    });
</script>
