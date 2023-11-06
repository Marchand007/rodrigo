<template>
    <v-app>
        <EnteteNavigation />
        <v-main>
            <router-view></router-view>
        </v-main>
    </v-app>
</template>

<script>

import EnteteNavigation from './components/EnteteNaviguation.vue';

export default {
    components: {
        EnteteNavigation
    },
}

</script>
