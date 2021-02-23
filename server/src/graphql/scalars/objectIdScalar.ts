import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'
import { Services } from '../../services'

export const makeObjectIdScalar = (services: Services) =>
  new GraphQLScalarType({
    name: 'ObjectId',
    description: 'MongoDB object id scalar',
    parseValue(value) {
      try {
        return services.database.generateId(value)
      } catch (e) {
        return null
      }
    },
    serialize(value) {
      return value ? value.toString() : null
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        try {
          return services.database.generateId(ast.value)
        } catch (e) {
          return null
        }
      }
      return null
    },
  })
