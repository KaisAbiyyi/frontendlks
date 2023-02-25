import axios from "axios";
import { createStore } from "vuex";

const store = createStore({
    state: {
        token: localStorage.getItem('token')
    },
    getters: {
        isLoggedIn: (state) => state.token != null
    },
    actions: {
        async login({ commit }, payload) {
            let response = await axios.post('user/login', payload)

            if (response.status == 200) {
                commit('SET_TOKEN', response.data.token)
                return response
            }
            return false
        },
        async logout({ commit }) {
            let response = await axios.post('user/logout', {
                headers: {
                    Authorization: 'Bearer ' + this.state.token
                }
            })

            if (response.status == 200) {
                commit('CLEAR_TOKEN')
                return true
            }
            return false
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

            localStorage.removeItem('token')
            delete axios.defaults.headers.common['Authorization']
        }
    }
})

export default store
