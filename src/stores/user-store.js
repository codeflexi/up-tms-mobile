import { defineStore } from 'pinia'
import { server } from '../boot/axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    id: null,
    firstName: null,
    lastName: null,
    email: null,
    token: null
  }),
  getters: {
    getId: (state) => {
      return state.id
    },
    getFirstName: (state) => {
      return state.firstName
    },
    getLastName: (state) => {
      return state.lastName
    },
    getEmail: (state) => {
      return state.email
    }
  },
  actions: {
    async getSanctumCookie() {
      try {
        await server.get('sanctum/csrf-cookie')
      } catch (error) {
        if (error) throw error
      }
    },

    async login(email, password) {
      try {
        return await server.post('/api/v1/auth/login', { email, password })
      } catch (error) {
        if (error) throw error
      }
    },

    async register(firstName, lastName, email, password, confirmPassword) {
      try {
        await server.post('/register', {
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          password_confirmation: confirmPassword
        })
      } catch (error) {
        if (error) throw error
      }
    },

    async logout() {
      try {
        await server.get("/api/v1/auth/logout");
        this.clearUser()
      } catch (error) {
        if (error) throw error
      }
    },

    async fetchUser() {
      try {
        return await server.get('/api/v1/auth/me')
      } catch (error) {
        if (error) throw error
      }
    },

    async updateUser(firstName, lastName) {
      try {
        const apiURL = `/api/v1/users/${this.id}`;
        return await server.put(apiURL, { name: firstName, last_name: lastName })
      } catch (error) {
        if (error) throw error
      }
    },

    setUser(payload) {
      if (payload._id) this.id = payload._id
      if (payload.name) this.firstName = payload.name
      if (payload.last_name) this.lastName = payload.last_name
      if (payload.email) this.email = payload.email
    },

    setToken(payload) {
      if (payload.token) this.token = payload.token
      if (payload.token) localStorage.setItem('token', payload.token);
    },

    clearUser() {
      this.id = null
      this.firstname = null
      this.lastname = null
      this.email = null
      this.token = null
    }
  },
  persist: true
})
