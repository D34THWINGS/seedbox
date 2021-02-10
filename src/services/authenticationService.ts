import { AsyncLocalStorage } from 'async_hooks'
import { forbidden } from '@hapi/boom'
import { User } from './databaseService'

type Session = {
  user: User
}

export const makeAuthenticationService = () => {
  const sessionStorage = new AsyncLocalStorage<Session>()

  return {
    injectSession: (user: User) => sessionStorage.enterWith({ user }),
    getAuthenticatedUser: () => {
      const session = sessionStorage.getStore()
      if (!session?.user) {
        throw forbidden()
      }
      return session.user
    },
  }
}

export type AuthenticationService = ReturnType<typeof makeAuthenticationService>
