<template>
  <AppLayout></AppLayout>
  <div class="container">
    <h1 class="m-0 p-0 mb-3">Polls</h1>
    <div class="p-3 bg-light rounded-4">
      <button
        type="button"
        class="btn btn-success"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Add Poll
      </button>
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered rounded-4">
          <div class="modal-content rounded-4 border-0">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Create a new Poll</h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeCreate"
              ></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="mb-3">
                  <label for="title" class="form-label">Title</label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    class="form-control"
                    v-model="pollData.title"
                  />
                </div>
                <div class="mb-3">
                  <label for="description" class="form-label">Description</label>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    class="form-control"
                    v-model="pollData.description"
                  />
                </div>
                <div class="mb-3">
                  <label for="deadline" class="form-label">Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    id="deadline"
                    class="form-control"
                    v-model="pollData.deadline"
                  />
                </div>
                <div class="mb-3">
                  <label for="choice" class="form-label">choice</label>
                  <div class="d-flex gap-2 mb-2" v-for="(choice, id) in pollData.choices" :key="id">
                    <input
                      type="text"
                      name="choice"
                      id="choice"
                      class="form-control"
                      v-model="pollData.choices[id]"
                    />
                    <button
                      class="btn btn-danger"
                      @click="pollData.choices.pop()"
                      v-if="id == pollData.choices.length - 1 && id > 0"
                    >
                      Remove
                    </button>
                  </div>
                  <button
                    type="button"
                    class="btn btn-success w-100 rounded-4"
                    @click="pollData.choices.push('')"
                  >
                    Add Choice
                  </button>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-success w-100 rounded-4" @click="createPoll">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Title</th>
            <th>Description</th>
            <th>Choice</th>
            <th>Deadline</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="poll in polls" :key="poll.id">
            <td>{{ poll.id }}</td>
            <td>{{ poll.title }}</td>
            <td>{{ poll.description }}</td>
            <td>
              <div v-for="choice in poll.result" :key="choice.id">{{ choice.name + ', ' }}</div>
            </td>
            <td>{{ poll.deadline }}</td>
            <td>
              <div class="btn-group" role="group">
                <button type="button" class="btn btn-success">Detail</button>
                <button type="button" class="btn btn-warning">Edit</button>
                <button type="button" class="btn btn-danger" @click="deletePoll(poll.id)">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import AppLayout from '../../components/AppLayout.vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

export default {
  data() {
    return {
      polls: [],
      token: localStorage.getItem('token'),
      router: useRouter(),
      pollData: {
        title: '',
        description: '',
        deadline: '',
        choices: ['']
      }
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
        })
        .catch((err) => {
          this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: err.data.message
          })
        })
    },
    createPoll() {
      axios
        .post(
          'poll',
          {
            ...this.pollData
          },
          {
            headers: {
              Authorization: 'Bearer ' + this.token
            }
          }
        )
        .then((result) => {
          this.router.push('/admin')
          document.getElementById('closeCreate').click()
          this.pollData = {}
          this.pollData.choices = ['']
          this.getPoll()
        })
        .catch((err) => {
          this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: err
          })
        })
    },
    deletePoll(id) {
      axios
        .delete('poll/' + id, {
          headers: {
            Authorization: 'Bearer ' + this.token
          }
        })
        .then((res) => {
          this.polls.splice(this.polls.indexOf(id - 1), 1)
          this.$swal({
            icon: 'success',
            text: res.data.message
          })
        })
        .catch((err) => {
          this.$swal({
            icon: 'error',
            text: err
          })
        })
    }
  },
  mounted() {
    this.getPoll()
  }
}
</script>