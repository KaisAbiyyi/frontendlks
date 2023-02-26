<template>
  <div class="mt-5">
    <form @submit.prevent="login" class="d-flex">
      <div class="position-absolute top-50 start-50 translate-middle w-25">
        <div class="card bg-warning border-0 rounded-4 mb-2 p-4">
          <h2 class="text-center p-0 m-0">YukPilih</h2>
        </div>
        <div class="card p-4 border-0 bg-success text-white rounded-4">
          <h4 class="mb-3">LOGIN</h4>
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              v-model="username"
              class="form-control"
              required
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              v-model="password"
              class="form-control"
              required
            />
          </div>
          <div class="mt-3">
            <button class="btn btn-warning rounded-4 fw-bold w-100" type="button" @click="login">
              LOGIN
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
  data() {
    return {
      store: useStore(),
      router: useRouter(),
      username: null,
      password: null,
      token: localStorage.getItem('token')
    }
  },
  mounted() {
    if (this.token) {
      this.router.push('/')
    }
  },
  methods: {
    login() {
      let status = this.store
        .dispatch('login', {
          username: this.username,
          password: this.password
        })
        .then((result) => {
          if (result.status == 200) {
            this.router.push('/')
          }
        })
        .catch((err) => {
          console.log(err)
          this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: err.response.data.message
          })
        })
    }
  }
}
</script>

