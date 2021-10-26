<template>
  <div>
    <h2>Home Works</h2>
    <v-card :loading="loading" class="mx-auto my-12" max-width="600">
      <template slot="progress">
        <v-progress-linear color="primary" height="10" indeterminate>

        </v-progress-linear>
      </template>
        <v-row>
          <v-col md="6">
            <v-img :src="movieImg"></v-img>
          </v-col>
          <v-col md="6" class="mt-5">
            <v-card-title>
              {{currentMovie.title}}
            </v-card-title>
            <v-card-text>
              <v-row align="center" class="mx-0">
                <div>{{currentMovie.overview}}</div>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-row class="d-flex justify-space-around"> 
                <v-btn color="green" @click="thumbsUp">
                  <v-icon>mdi-thumb-up</v-icon>
                </v-btn>
                <v-btn color="red" @click="thumbsDown">
                  <v-icon>mdi-thumb-down</v-icon>
                </v-btn>
              </v-row>
            </v-card-actions>
          </v-col>
        </v-row>
    </v-card>
    <v-row>
      <v-col class="text-center">
        Powered by lo que yo quiera poner
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import axios from 'axios'
  import { getAuth } from "firebase/auth";
  import { arrayUnion, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
  import { db } from '../main';
  export default {
    name: 'Home',

    data: () => ({
      loading: false,
      movies: [],
      currentMovie: {},
      currentIndex: 0,
      currentPage: 1
    }),
    async created() {
      await this.getMovies(this.currentPage)
    },
    methods: {
      async getMovies (page) {
        const res = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=79f027d7ecc5acc028a91130965f976b&language=en-ES&sort_by=popularity.desc&include_adult=true&include_video=false&page=${page}&with_watch_monetization_types=flatrate`)
       if (res.data && res.data.results.length > 0) {
          this.movies = res.data.results
          this.currentMovie = this.movies[0]
        }
      },
      async incrementCurrentIndex() {
        if (this.currentIndex === this.movieslength - 1) {
          console.log('es el final');
          // this.currentPage++
          // this.getMovies(this.currentPage) 
          // this.currentIndex = 0
        } else {
          this.currentIndex++
          console.log(this.currentIndex);
          this.currentMovie = this.movies[this.currentIndex]
        }
      },
      async thumbsUp() {

        // Autentificacion necesaria 
        getAuth()

        // Consigue referencia del documento
        let userRef = await doc(db,'users',this.userId)

        //Consigue el documento
        // userRef = await getDoc(userRef)

        // Actualiza el documento con su referncia y añade valores a su array
        updateDoc(userRef, {
          likedMovies: arrayUnion(this.currentMovie)
        })
        

        //necesario revisarlo
        if (this.partnerId) {
          let q = query(collection(db,'users',this.partnerId,'likedMovies'),where('id','==',this.currentMovie.id))
          const partnerLiked = await getDocs(q)

          if (!partnerLiked.empty) {
            updateDoc(userRef, {
              matches: arrayUnion(this.currentMovie)
            })
            let partnerRef = await doc(db,'users',this.partnerId)
            updateDoc(partnerRef, {
              matches: arrayUnion(this.currentMovie)
            })
          }
        }
        // let partnerRef = await doc(db,'users', this.partnerId)
        this.incrementCurrentIndex()
      },
      async thumbsDown() {
        await this.incrementCurrentIndex()
      }

    },
    computed: {
      movieslength() {
        return this.movies.length
      },
      userId() {
        return this.$store.state.user.id
      },
      partnerId() {
        return this.$store.state.user.partnerId
      },
      movieImg() {
        console.log(this.currentMovie);
        return this.currentMovie.poster_path ? `https://image.tmdb.org/t/p/w500${this.currentMovie.poster_path}` : ''
      }
    }
  }
</script>
