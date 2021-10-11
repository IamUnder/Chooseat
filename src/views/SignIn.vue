<template>
  <v-card class="mx-auto" style="max-width: 500px">
      <v-overlay :value="loading">
          <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-form ref="formValidation" v-model="formValidation" class="pa-4 mt-6">
          <v-text-field v-model="email" :rules="[validation.required]" filled label="Correo electronico" type="email"></v-text-field>
          <v-text-field v-model="password" :rules="[validation.required]" filled label="Contraseña" type="password" style="min-height: 96px" autocomplete="on"></v-text-field>
      </v-form>
      <v-alert v-if="errorMsg" border="top" color="red" class="ml-5 mr-5">
          {{errorMsg}}
      </v-alert>
      <v-divider></v-divider>
      <v-card-actions>
          <v-btn text @click="$refs.formValidation.reset()">Limpiar formulario</v-btn>
          <v-spacer/>
          <v-btn :disabled="!formValidation" color="primary" :loading="loading" depressed @click="signIn">Iniciar sesión</v-btn>
      </v-card-actions>
  </v-card>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../main'
export default {
    data: () => ({
        email: '',
        password: '',
        errorMsg: '',
        formValidation: false,
        loading: false,
        validation: {
            required: v => !!v || 'Este campo es obligatorio'
        }
    }),
    methods: {
        async signIn() {
            this.loading = true;
    
            const auth = getAuth();
            signInWithEmailAndPassword(auth, this.email.toLowerCase(), this.password)
                .then(async () => {

                    let q = query(collection(db, "users"), where("email", "==", this.email.toLowerCase()));
                    let user = await getDocs(q)
                    user.forEach((doc) => {
                        this.$store.dispatch('user/setUserData',{
                            id: doc.id,
                            name: doc.data().name,
                            email: doc.data().email
                        })
                    });
        
                    this.loading = false
                    this.$router.replace({ name: "Home" });
                })
                .catch(() => {
                    this.errorMsg = 'Error en la autenficación.'
                    this.loading = false
                });
        },
        test () {
            this.loading = true
        }
    }
}
</script>

<style>

</style>