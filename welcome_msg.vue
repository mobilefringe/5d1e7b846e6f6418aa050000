<template>
    <div v-if="currentMessage" class="main_container">
        <div class="message_content">
            <h1 class="center">{{ currentMessage.title }}</h1>
            <p class="center">{{ currentMessage.body }}</p> 
        </div>
    </div>
</template>

<script>
    define(["Vue", "vuex"], function(Vue, Vuex){
        return Vue.component("messages-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    currentMessage: null
                }
            },
            created(){
                this.loadData().then(response => {
                    if(response[0].data.messages.welcome[0] != undefined){
                        this.currentMessage = response[0].data.messages.welcome[0].messages[0];
                    } else {
                        console.log("No message at this time.");       
                    }
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property'
                ])
            },
            methods: {
                loadData: async function() {
                    this.property.mm_host = this.property.mm_host.replace("http:", "");
                    try {
                        let results = await Promise.all([this.$store.dispatch('LOAD_PAGE_DATA', {url:this.property.mm_host + "/api/v3/cerritos/messages.json"})]);
                        return results;
                    } catch(e) {
                        console.log("Error loading data: " + e.message);    
                    }
                }
            }
        })
    });
</script>