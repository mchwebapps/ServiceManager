import type { CurrentUserDTO } from "@/core/dtos/currentUser/CurrentUserDto"
import type { ICurrentUserService } from "@/core/services/CurrentUserService"
import { defineStore } from "pinia"
import { container } from "tsyringe"

const useCurrentUser = defineStore({
  id: 'useCurrentUser',
  state: () => ({ user: null as unknown as CurrentUserDTO }),
  getters: {
    getCurrentUser(state) {
      return state.user
    }
  },
  actions: {
    async loadUserProfile() {
      const currentUserService = container.resolve('ICurrentUserService') as ICurrentUserService
      const currentUser: CurrentUserDTO = await currentUserService.getCurrentUser()
      this.user = currentUser
    },
    login(returnUrl: string) {
      const currentUserService = container.resolve('ICurrentUserService') as ICurrentUserService
      window.location.href = currentUserService.getLoginUrl(returnUrl)
    },
    async logout() {
      this.user = null!
      const currentUserService = container.resolveAll('ICurrentUserService') as ICurrentUserService[]
      Promise.all(currentUserService.map(async x => await x.logout()))
    }
  }
})
export { useCurrentUser }
