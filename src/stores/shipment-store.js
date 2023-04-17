import { defineStore } from 'pinia'
import { server } from '../boot/axios'

export const useShipmentStore = defineStore('shipment', {
  state: () => ({
    id: null,
    picking_number: null,
    warehouse: null,
    address: null,
    company: null,
    number_shipment: null
  }),

  getters: {
    getId: (state) => {
      return state.id
    },
    getPickingNumer: (state) => {
      return state.picking_number
    },
    getWarehouse: (state) => {
      return state.warehouse
    },
    getAddress: (state) => {
      return state.address
    },
    getCompany: (state) => {
      return state.company
    },
    getNumberShipment: (state) => {
      return state.number_shipment
    }
  },
  actions: {
    async fetchShipmentByDriver(id) {
      try {
        const apiURL = `/api/v1/shipments?driver=${id}&is_by_pass=Y&status=PICKING UP`;
        return await server.get(apiURL)
      } catch (error) {
        if (error) throw error
      }
    },
    async fetchSingleShipment(id) {
      try {
        const apiURL = `/api/v1/shipments/${id}`;
        return await server.get(apiURL)
      } catch (error) {
        if (error) throw error
      }
    },
    async updateShipment(id, data) {
      try {
        const apiURL = `/api/v1/shipments/direct-pickup/${id}`;
        const update = {
          photo: data.photo,
          signature: data.signature
        }
        return await server.put(apiURL, update)
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
    async fetchShipmentById(id) {
      try {
        const apiURL = `/api/v1/shipments?waybill_number=${id}`;
        return await server.get(apiURL)
      } catch (error) {
        if (error) throw error
      }
    },
    async fetchPickingById(id) {
      try {
        const apiURL = `/api/v1/shipment-picks/${id}`;
        return await server.get(apiURL)
      } catch (error) {
        if (error) throw error
      }
    },

    async handleCreatePicking(data) {
      try {
        const apiURL = '/api/v1/shipment-picks/picked';
        return await server.post(apiURL, data)
      } catch (error) {
        if (error) throw error
      }
    },

    setShipment(payload) {
      if (payload.id) this.id = payload.id
      if (payload.picking_number) this.picking_number = payload.picking_number
      if (payload.warehouse) this.warehouse = payload.warehouse
      if (payload.address) this.address = payload.address
      if (payload.number_shipment) this.number_shipment = payload.number_shipment
    },

    clearShipment() {
      this.id = null
      this.picking_number = null
      this.warehouse = null
      this.address = null
      this.company = null
      this.number_shipment = null
    }
  },
  persist: true
})
