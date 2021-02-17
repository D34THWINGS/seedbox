import { User } from '../services/databaseService'
import { Services } from '../services'

export type GraphQLContext = {
  services: Services
  auth: {
    user: User
  }
}
