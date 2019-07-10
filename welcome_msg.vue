<template>
    <div v-if="property" class="main_container">
        <div class="message_content">
            <h1 class="inside_heading">{{ property.welcome_message }}</h1>
            <h2 class="inside_subheading">{{ property.description }}</h2>
        </div>
    </div>
</template>

<script>
    define(["Vue", "vuex"], function(Vue, Vuex){
        return Vue.component("messages-component", {
            template: template, // the variable template will be injected
            computed: {
                ...Vuex.mapGetters([
                    'property'
                ])
            }
        })
    });
</script>