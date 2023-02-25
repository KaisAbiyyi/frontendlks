<template>
  <AppLayout></AppLayout>
  <div class="container">
    <h1>Dashboard</h1>
    <div class="row">
      <div class="col" v-for="poll in polls" :key="poll.id">
        <div class="card border-0 rounded-4 bg-success p-3">
          <h5 class="card-title text-white m-0">{{ poll.title }}</h5>
          <div class="card-body m-0">
            <div class="row mt-3" v-for="choice in poll.result" :key="choice.id">
              <div
                class="progress p-0"
                role="progressbar"
                aria-label="Info example"
                :aria-valuenow="choice.percentage"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div
                  class="progress-bar bg-warning rounded-2"
                  :style="{ width: choice.percentage + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppLayout from '../components/AppLayout.vue'
import axios from 'axios'
export default {
  data() {
    return {
      polls: [],
      token: localStorage.getItem('token')
    }
  },
  components: {
    AppLayout
  },
  created() {
    axios
      .get('poll', {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      })
      .then((res) => {
        this.polls = res.data.data
      })
      .catch((err) => {
        this.$swal({
          icon: 'error',
          title: 'Oops...',
          text: err.data.message
        })
      })
  }
}
</script>