<template>
  <AppLayout></AppLayout>
  <div class="container">
    <h1>Dashboard</h1>
    <div class="row">
      <div class="col-3" v-for="poll in polls" :key="poll.id">
        <div class="card border-0 rounded-4 bg-success p-2">
          <h5 class="card-title text-white m-0 text-center">{{ poll.title }}</h5>
          <div
            class="badge mt-3"
            :class="{
              'bg-warning': new Date(poll.deadline) > new Date(),
              'text-dark': new Date(poll.deadline) > new Date(),
              'bg-danger': new Date(poll.deadline) < new Date()
            }"
          >
            {{ poll.deadline }}
          </div>
          <div class="card-body mt-2 rounded-3 bg-light">
            <div class="row" v-if="poll.total_vote != null">
              <h6 class="m-0 text-center p-0">HASIL</h6>
              <div v-for="choice in poll.choices" :key="choice.id">
                <div class="p-0 m-0 d-flex justify-content-between w-100">
                  <span>{{ choice.name }}</span>
                  <span>{{ (choice.percentage ?? 0) + '%' }}</span>
                </div>
                <div
                  class="progress p-0 bg-success"
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
            <div class="row" v-else>
              <h6 class="m-0 text-center mb-3 p-0">VOTE</h6>
              <div class="col-6 mt-2" v-for="choice in poll.choices" :key="choice.id">
                <button
                  class="btn btn-success h-100 rounded-5 w-100"
                  @click="vote(choice.poll_id, choice.id, choice.name)"
                >
                  {{ choice.name }}
                </button>
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
import { useStore } from 'vuex'
export default {
  data() {
    return {
      polls: [],
      now: new Date(),
      token: localStorage.getItem('token')
    }
  },
  components: {
    AppLayout
  },
  methods: {
    getPoll() {
      axios
        .get('poll', {
          headers: {
            Authorization: 'Bearer ' + this.token
          }
        })
        .then((res) => {
          this.polls = res.data.data
          console.log(res.data)
        })
        .catch((err) => {
          this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: err.data.message
          })
        })
    },
    vote(poll_id, choice_id, choice_name) {
      this.$swal({
        title: 'Are you sure with you choice?',
        text: 'Your choice: ' + choice_name,
        showCancelButton: true,
        confirmButtonText: 'Sure!'
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .post(
              'poll/' + poll_id + '/vote/' + choice_id,
              {},
              {
                headers: {
                  Authorization: 'Bearer ' + this.token,
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              }
            )
            .then((res) => {
              this.$swal({
                icon: 'success',
                text: res.data.message
              })
              this.getPoll()
            })
            .catch((err) => {
              console.log(err)
            })
        }
      })
    }
  },
  mounted() {
    this.getPoll()
    console.log(this.now)
  }
}
</script>