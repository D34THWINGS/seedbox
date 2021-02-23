import { AsyncLocalStorage } from 'async_hooks'
import { forbidden } from '@hapi/boom'
import { DocumentId } from './database/databaseSchema'
import { LoadersService } from './loaders/loadersService'

type Session = {
  userId: DocumentId
}

export const makeAuthenticationService = (loadersService: LoadersService) => {
  const sessionStorage = new AsyncLocalStorage<Session>()

  const getAuthenticatedUserId = () => {
    const session = sessionStorage.getStore()
    if (!session?.userId) {
      throw forbidden()
    }
    return session.userId
  }

  return {
    injectSession: (userId: DocumentId) => sessionStorage.enterWith({ userId }),
    getAuthenticatedUserId,
    getAuthenticatedUser: async () => {
      const userId = getAuthenticatedUserId()
      const user = await loadersService.userLoader.load(userId)
      if (!user || user.disabledAt) {
        throw forbidden()
      }
      return user
    },
  }
}

export type AuthenticationService = ReturnType<typeof makeAuthenticationService>
