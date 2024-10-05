import { useCurrentUser } from "@/store/user"
import type { AxiosResponse } from "axios"
import { container } from "tsyringe"
import { HttpStatusCode } from "@/core/enums/HttpStatusCode"
import ValidationError from "@/core/errors/ValidationError"
import type { ICurrentUserService } from "@/core/services/CurrentUserService"

export default function axiosErrorDecorator() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    descriptor.value = async function (...args: any) {
      try {
        let result = await originalMethod.apply(this, args) as AxiosResponse

        if (result.status == HttpStatusCode.BadRequest) {
          throw new ValidationError(result.data.errors)
        }

        if (result.status == HttpStatusCode.Unauthorized) {
          const currentUserStore = useCurrentUser()

          try {
            const currentUserService = container.resolve('ICurrentUserService') as ICurrentUserService
            // const returnUrl = `${window.location.origin}/login-success`

            // const win = window.open(currentUserService.getLoginUrl(returnUrl), "LOGIN", "height=640,width=960,toolbar=no,menubar=no,scrollbars=no,location=no,status=no")
            // const returnUrl = window.location.href
            // const win = window.open(currentUserService.getLoginUrl(returnUrl), "_blank")

            // if (win != null) {
            //   win.focus()

            //   result = await new Promise((resolve, reject) => {
            //     const timer = setInterval(() => {
            //       if (win.closed) {
            //         currentUserStore.loadUserProfile().then(() => {
            //           clearInterval(timer)
            //           return originalMethod.apply(this, args)
            //         }).then(response => resolve(response))
            //       }
            //     }, 500)
            //   })
            // }
          } catch (error) {
            currentUserStore.logout()
          }
        }
        return result
      }
      catch (error) {
        if (error instanceof ValidationError) {
          for (const key in error.Errors) {
            console.log(error.Errors[key])
          }
        } 
        else {
          console.log(error)
        }
        throw error
      }
    }
    return descriptor
  }
}
