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
                    <p>Para buscar introduce el codigo electronico, codigo de sala o link de invitación.</p>
                    <v-row>
                        <v-form ref="form" v-model="searchForm">
                            <v-col class="d-inline-flex">
                                <v-text-field v-model="email" :rules="[validations.required]" filled label="Codigo de sala o correo o invitación" type="text" :full-width='true'></v-text-field>
                                <v-btn @click="search()" :disabled="!searchForm" large color="primary" class="mt-2 ml-4" depressed>Buscar</v-btn>
                            </v-col>
                        </v-form>
                    </v-row>
                    <v-row v-if="found">
                        <v-col class="">
                            <v-card v-for="room in found" v-bind="found" :key="room" class="mt-4">
                                <v-card-text>
                                    <div>
                                        {{room.owner}}
                                    </div>
                                    <p class="display-1 text-primary">
                                        Codigo: {{room.code}}
                                    </p>
                                    <div class="text-primary">
                                        Para añadir este usuario, haz click en boton "Añadir" de debajo.
                                    </div>
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn color="primary" @click="add">Añadir</v-btn>
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
        searchForm: false,
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
            // Establecemos los valores iniciales.
            this.loading = true
            this.msg = ''

            // Hacemos el login en firebase
            getAuth()

            // Comprobamos si el usuario ha introducido un email
            let q = query(collection(db, 'users'), where('email', '==', this.email.toLowerCase()))
            let user = await getDocs(q)
            // Si el usuario esta vacio comprobaremos si es un codigo de sala
            if (user.empty) {
                let qR = query(collection(db,'rooms'), where('code','==',this.email))    
                let room = await getDocs(qR)

                room.forEach((rDoc) => {
                    this.found = {
                        code: rDoc.data().code,
                        owner: rDoc.data().idOwner
                    }
                })

            // Si el usuario se ha encontrado comprobamos las salas que posee
            } else {
                user.forEach(async (doc) => {
                    let id = doc.id
                    let docMail = doc.data().email
                    let qR = query(collection(db, 'rooms'), where('idOwner','==',id))
                    let room = await getDocs(qR)

                    // Comprobamos si el usuario tiene salas
                    // si no las tiene mandaremos el mensaje de error, si las tiene las mostraremos.
                    if (room.empty) {
                        this.msg = 'El usurio no es propietario de ninguna sala.'
                    } else {
                        this.found = []
    
                        room.forEach((rDoc) => {
                            this.found.push({
                                code: rDoc.data().code,
                                owner: docMail
                            })
                        })
                    }

                })
            }



            
            
            this.loading = false
        },
        async add () {
            console.log('equisde');
            // try {
            //     const userId = this.$store.state.user.id
            //     console.log(userId);

            //     const authUser = doc(db, 'users', userId)
            //     await updateDoc(authUser, { partnerId: id });

            //     this.$store.dispatch('user/setPartner', id)

            //     this.color = 'success'
            //     this.alertMsg = 'Compañero agregado correctamente.'
            //     this.show = true
            // } catch (error) {

            //     this.color = 'red'
            //     this.alertMsg = 'Ha ocurrido un error.Pruebe otra vez.'
            //     this.show = true
            // }
        },
        async create() {
            // Establecemos los valores necesarios
            this.loading = true
            this.createMsg = ''

            // Procedemos a hacer el Auth de firebase y comprobamos si la sala existe 
            getAuth()
            let q = query(collection(db, 'rooms'), where('code', '==', this.code))
            let room = await getDocs(q)
            
            // Comprobamos si la sala existe
            // Si la sala existe devolvemos un codigo de error
            // Si no existe la creamos
            if (!room.empty) {
                this.createMsg = 'Ya hay una sala con ese codigo.'    
                this.loading = false
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

                this.loading = false
                this.$router.replace({name: 'Home'})
            }
            
        } 
    }
}
</script>

<style>
    
</style>