<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-success mb-3 p-3">
    <div class="container">
      <router-link to="/dashboard" class="navbar-brand">YukPilih</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse d-flex justify-content-between" id="navbarNavAltMarkup">
        <div class="navbar-nav" v-if="this.role === 'admin'">
          <router-link to="/" class="nav-item nav-link active">Poll</router-link>
        </div>
        <div class="navbar-nav">
          <button type="button" @click="logout" class="nav-item nav-link border-0 bg-transparent">
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import axios from 'axios'

export default {
  data() {
    return {
      store: useStore(),
      router: useRouter(),
      token: localStorage.getItem('token'),
      role: localStorage.getItem('role')
    }
  },
  methods: {
    logout() {
      this.$swal({
        title: 'Are you sure?',
        showCancelButton: true,
        confirmButtonText: 'Sure!'
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .post(
              'user/logout',
              {},
              {
                headers: {
                  Authorization: `Bearer ${this.token}`,
                  'Content-Type': 'application/json'
                }
              }
            )
            .then((res) => {
              localStorage.removeItem('token')
              localStorage.removeItem('role')
              this.router.push('/login')
              this.store.dispatch('logout')
            })
            .catch((err) => {
              this.$swal({
                icon: 'error',
                title: 'Oops...',
                text: err.response.data.message
              })
            })
        }
      })
    }
  }
}
</script>