import axios from "axios";
import { createStore } from "vuex";

const store = createStore({
    state: {
        token: localStorage.getItem('token'),
        role: localStorage.getItem('role')
    },
    getters: {
        isLoggedIn: (state) => state.token != null
    },
    actions: {
        async login({ commit }, payload) {
            let response = await axios.post('user/login', payload)

            if (response.status == 200) {
                commit('SET_TOKEN', response.data.token)
                localStorage.setItem('role', response.data.data.role)
                return response
            }
            return false
        },
        async logout({ commit }) {
            commit('CLEAR_TOKEN')
            return true
        },
        getRole() {
            return this.state.role
        }
    },
    mutations: {
        SET_TOKEN(state, payload) {
            state.token = payload

            localStorage.setItem('token', payload)
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + state.token
        },
        CLEAR_TOKEN(state) {
            state.token = null
            delete axios.defaults.headers.common['Authorization']
        }
    }
})

export default store
