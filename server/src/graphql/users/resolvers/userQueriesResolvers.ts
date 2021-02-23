import { GQLResolvers } from '../../schemaTypes'

export const userQueriesResolvers: GQLResolvers['Query'] = {
  me: (_, __, { services }) => services.authentication.getAuthenticatedUser(),
}
