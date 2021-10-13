<template>
    <div>
        <v-overlay :value="loading">
            <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-container>
            <v-card>
                <v-container>
                    <h2>Crear una sala</h2>
                    <p>Crea tu sala para compartirla con tus amigos</p>
                    <v-row>
                        <v-form ref="creationForm" v-model="creationForm">
                            <v-col class="d-inline-flex">
                                <v-text-field v-model="code" :rules="[validations.required, validations.maxLength(4), validations.length(4)]" filled label="Codigo" type="number" ></v-text-field>
                                <v-text-field v-model="password" :rules="[validations.required, validations.length(4), validations.maxLength(6)]" filled label="Password" type="text" class="ml-4" counter="4"></v-text-field>
                                <v-btn @click="create()" :disabled="!creationForm" large color="primary" class="mt-2 ml-4" depressed>Crear sala</v-btn>
                            </v-col>
                        </v-form>
                    </v-row>
                     <v-row v-if="createMsg">
                        <v-col>
                            <h3>{{createMsg}}</h3>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
            <v-snackbar :timeout="3000" :value="show" absolute top right :color="color">
                {{alertMsg}}
            </v-snackbar>
        </v-container>
        <v-container>
            <v-card>
                <v-container>
                    <h2>Unirse a una sala</h2>
                    <p>Introduce el codigo de sala y su contraseña para unirte a ella.</p>
                    <v-row>
                        <v-form ref="form" v-model="form">
                            <v-col class="d-inline-flex">
                                <v-text-field v-model="email" :rules="[validations.required]" filled label="Dirección de correo" type="email"></v-text-field>
                                <v-btn @click="search()" :disabled="!creationForm" large color="primary" class="mt-2 ml-4" depressed>Buscar</v-btn>
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
        </v-container>
    </div>
</template>

<script>
import { collection, query, where, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../main'
import { getAuth } from '@firebase/auth';
export default {
    data : () => ({
        form: false,
        creationForm: false,
        code: '',
        password: '',
        loading: false,
        color: '',
        alertMsg: '',
        show: false,
        email: '',
        found: null,
        msg: '',
        createMsg: '',
        validations: {
            required: v => !!v || 'Este campo es obligatorio',
            length: len => v => (v || '').length >= len || `La contraseña es demasiado corta, necesita ${len} caracteres`,
            maxLength: len => v => (v || '').length <= len || `La contraseña es demasiado larga, necesita ${len} caracteres`,
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
        },
        async create() {
            console.log(this.code + this.password);
            // Establecemos los valores necesarios
            this.loading = true
            this.createMsg = ''

            // Procedemos a hacer el Auth de firebase y comprobamos si la sala existe 
            getAuth()
            let q = query(collection(db, 'rooms'), where('code', '==', this.code))
            let user = await getDocs(q)
            // user.forEach((doc) => {
            //     this.found = {
            //         email: doc.data().email,
            //         name: doc.data().name,
            //         id: doc.id
            //     }
            // });

            if (!user.empty) {
                this.createMsg = 'Ya hay una sala con ese codigo.'    
            } else {
                // Creamos el documento de la sala
                addDoc(collection(db, 'rooms'), {
                    code: this.code,
                    password: this.password,
                    idOwner: this.$store.state.user.id
                }).then( async ()=>{
                    // Añadimos la sala al usuario en vue
                    this.$store.dispatch('user/setRoom',this.code)
                    // Añadimos la sala al usuario en Firebase
                    let userId = this.$store.state.user.id
                    let userRef = doc(db, 'users', userId)
                    await updateDoc(userRef, {roomCode: this.code})
                })
            }
            
            this.loading = false
            this.$router.replace({name: 'Home'})
        } 
    }
}
</script>

<style>
    
</style>