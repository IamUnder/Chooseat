  <template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <h2>Chooseat</h2>
      </div>

      <v-spacer></v-spacer>
      <v-btn v-if="userId" to="/addPartner" text>
        Añadir compañero
      </v-btn> 
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
  computed: {
    userId () {
      return this.$store.state.user.id
    }
  }
};
</script>
