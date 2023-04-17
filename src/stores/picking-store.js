import { defineStore } from 'pinia'
import { server } from '../boot/axios'

export const usePickingStore = defineStore('picking', {
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
    async fetchPicking(id) {
      try {
        const apiURL = `/api/v1/shipment-picks/driver/${id}`;
        return await server.get(apiURL)
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

    setPicking(payload) {
      if (payload.id) this.id = payload.id
      if (payload.picking_number) this.picking_number = payload.picking_number
      if (payload.warehouse) this.warehouse = payload.warehouse
      if (payload.address) this.address = payload.address
      if (payload.number_shipment) this.number_shipment = payload.number_shipment
    },



    clearUser() {
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
