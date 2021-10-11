<template>
  <v-card class="mx-auto" style="max-width: 500px">
      <v-overlay :value="loading">
          <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-form ref="formValidation" v-model="formValidation" class="pa-4 mt-6">
          <v-text-field v-model="name" :rules="[validation.required]" filled label="Nombre"></v-text-field>
          <v-text-field v-model="email" :rules="[validation.email]" filled label="Correo electronico" type="email"></v-text-field>
          <v-text-field v-model="password" :rules="[validation.password, validation.length(6)]" filled label="Contraseña" type="password" counter="6" style="min-height: 96px" autocomplete="on"></v-text-field>
      </v-form>
      <v-alert v-if="errorMsg" border="top" color="red" class="ml-5 mr-5">
          {{errorMsg}}
      </v-alert>
      <v-divider></v-divider>
      <v-card-actions>
          <v-btn text @click="$refs.form.reset()">Limpiar formulario</v-btn>
          <v-spacer/>
          <v-btn :disabled="!formValidation" color="primary" :loading="loading" depressed @click="signUp">Registrate</v-btn>
      </v-card-actions>
  </v-card>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../main'
export default {
    data: () => ({
        name: '',
        email: '',
        password: '',
        errorMsg: '',
        formValidation: false,
        loading: false,
        validation: {
            email: v => !!(v || '').match(/@/) || 'Por favor introduce un email valido',
            length: len => v => (v || '').length >= len || `La contraseña es demasiado corta, necesita ${len} caracteres`,
            password: v => !!(v || '').match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/) || 'La contraseña debe contener al menos mayuscula, minuscula, numero y caracter especial',
            required: v => !!v || 'Este campo es obligatorio'

        }
    }),
    methods: {
        signUp() {
            this.loading = true;
    
            const auth = getAuth();
            createUserWithEmailAndPassword(auth, this.email.toLowerCase(), this.password)
                .then((userCredential) => {
                    this.$store.dispatch('user/setUserData',{
                        id: userCredential.user.uid,
                        name: this.name,
                        email: this.email
                    })

                    addDoc(collection(db, 'users'), { name: this.name, email: this.email.toLowerCase() })

                    this.loading = false
                    this.$router.replace({ name: "Home" });
                })
                .catch((error) => {
                    this.errorMsg = 'Ha sucedido un error.'
                    if(error.message) {
                        this.loading = false
                        if(error.message == 'Firebase: Error (auth/email-already-in-use).'){
                            this.errorMsg = 'El correo ya esta en uso.'
                        }else{
                            this.errorMsg = error.message
                        }
                    }
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