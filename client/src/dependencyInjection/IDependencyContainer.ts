import type { DependencyContainer } from "tsyringe"
import type { App } from "vue"

export interface IDependencyContainer {
    registerTypes(): void
}
