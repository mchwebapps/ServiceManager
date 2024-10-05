import { defineStore } from "pinia"

export const useBodyClass = defineStore({
  id: 'useBodyClass',
  state: () => ({ className: '' }), //sidebar-toggled
  getters: {
    getBodyClass(state) {
      return state.className
    }
  },
  actions: {
    setBodyClass(x: string) {
      this.className = x
    }
  }
})