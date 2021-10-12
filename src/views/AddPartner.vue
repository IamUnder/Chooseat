<template>
    <div>
        <v-overlay :value="loading">
            <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-container>
            <v-card>
                <v-container>
                    <h2>Busqueda de compañero</h2>
                    <p>Busca a tu compañero por email</p>
                    <v-row>
                        <v-form ref="form" v-model="form">
                            <v-col class="d-inline-flex">
                                <v-text-field v-model="email" :rules="[validations.email]" filled label="Dirección de correo" type="email"></v-text-field>
                                <v-btn @click="search()" :disabled="!form" large color="primary" class="mt-2 ml-2">Buscar</v-btn>
                            </v-col>
                        </v-form>
                    </v-row>
                    <v-row v-if="found">
                        <v-col class="d-inline-flex">
                            <v-card>
                                <v-card-text>
                                    <div>
                                        {{found.email}}
                                    </div>
                                    <p class="display-1 text-primary">
                                        {{found.name}}
                                    </p>
                                    <div class="text-primary">
                                        Para añadir este usuario, haz click en boton "Añadir" de debajo.
                                    </div>
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn color="primary" @click="add(found.id)">Añadir</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-row v-if="msg">
                        <v-col>
                            <h3>{{msg}}</h3>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
            <v-snackbar :timeout="3000" :value="show" absolute top right :color="color">
                {{alertMsg}}
            </v-snackbar>
        </v-container>
    </div>
</template>

<script>
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../main'
import { getAuth } from '@firebase/auth';
export default {
    data : () => ({
        form: false,
        loading: false,
        color: '',
        alertMsg: '',
        show: false,
        email: '',
        found: null,
        msg: '',
        validations: {
            email: v => !!( v || '').match(/@/) || 'Por favor introduce un email valido.'
        }
    }),
    methods: {
        async search () {
            this.loading = true
            this.msg = ''

            getAuth()
            let q = query(collection(db, 'users'), where('email', '==', this.email.toLowerCase()))
            let user = await getDocs(q)
            user.forEach((doc) => {
                this.found = {
                    email: doc.data().email,
                    name: doc.data().name,
                    id: doc.id
                }
            });

            if (user.empty) {
                this.found = null
                this.msg = 'No hay ningun usuario con ese correo.'    
            }
            
            this.loading = false
        },
        async add (id) {
            try {
                const userId = this.$store.state.user.id
                console.log(userId);

                const authUser = doc(db, 'users', userId)
                await updateDoc(authUser, { partnerId: id });

                this.$store.dispatch('user/setPartner', id)

                this.color = 'success'
                this.alertMsg = 'Compañero agregado correctamente.'
                this.show = true
            } catch (error) {

                this.color = 'red'
                this.alertMsg = 'Ha ocurrido un error.Pruebe otra vez.'
                this.show = true
            }
        } 
    }
}
</script>

<style>
    
</style>