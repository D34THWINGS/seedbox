import { AsyncLocalStorage } from 'async_hooks'
import { forbidden } from '@hapi/boom'
import { DocumentId } from './database/databaseSchema'
import { LoadersService } from './loaders/loadersService'

type Session = {
  userId: DocumentId
}

export const makeAuthenticationService = (loadersService: LoadersService) => {
  const sessionStorage = new AsyncLocalStorage<Session>()

  return {
    injectSession: (userId: DocumentId) => sessionStorage.enterWith({ userId }),
    getAuthenticatedUser: async () => {
      const session = sessionStorage.getStore()
      if (!session?.userId) {
        throw forbidden()
      }
      const user = await loadersService.userLoader.load(session.userId)
      if (!user || user.disabledAt) {
        throw forbidden()
      }
      return user
    },
  }
}

export type AuthenticationService = ReturnType<typeof makeAuthenticationService>
