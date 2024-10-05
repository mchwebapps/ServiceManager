import type { CurrentUserDTO } from "@/core/dtos/currentUser/CurrentUserDto"
import type { IApiService } from "@/core/services/ApiService"

export interface ICurrentUserService {
    getLoginUrl(returnUrl: string): string,
    getCurrentUser(): Promise<CurrentUserDTO>
    logout(): Promise<void>
}

// export class CurrentUserService implements ICurrentUserService {

//     constructor(private apiService: IApiService) {

//     }
//     async logout(): Promise<void> {
//          await this.apiService.get('/auth/logout')
//     }
//     getLoginUrl(returnUrl: string): string {
//         return `${this.apiService.baseUrl}/auth/login?returnUrl=${returnUrl}`
//     }
//     async getCurrentUser(): Promise<CurrentUserDTO> {
//         const userResponse = await this.apiService.get<CurrentUserDTO>("/auth/user")
//         return userResponse.data 
//     }
// }

export class CurrentUserService implements ICurrentUserService {

    constructor(private apiService: IApiService) {

    }
    getLoginUrl(returnUrl: string): string {
        return `${this.apiService.baseUrl}/auth/login?returnUrl=${returnUrl}`
    }
    async getCurrentUser(): Promise<CurrentUserDTO> {

        return {
            userId: '7cc24073-97ae-4a33-9373-aac57f3a8f7d',
            organizationId: '66711026-6865-4420-861e-8fb990e08044',
            email: 'owner@localhost',
            name: 'Owner Account',
            hasActiveSubscription: true,
            administrativeRoles: ['organization-owner']
        } as CurrentUserDTO
    }
    async logout(): Promise<void> {
         await this.apiService.get('/auth/logout')
    }
}