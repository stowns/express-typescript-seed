import {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInt
  } from 'graphql';

import * as GraphQLTools from "graphql-tools";
import * as GraphQLToolsTypes from "graphql-tools-types";

export class GraphQLSchemaBuilder {

    static build(gts): GraphQLSchema {
        const definition = GraphQLSchemaBuilder.buildDefinition(gts);
        const resolvers = GraphQLSchemaBuilder.buildResolvers(gts);

        return GraphQLTools.makeExecutableSchema({
            typeDefs: [ definition ],
            resolvers: resolvers
        });
    }

    static buildDefinition(gts): String {
        return `
            schema {
                query:    Root
                mutation: Root
            }
            scalar UUID
            scalar JSON
            type Root {
                ${gts.entityQuerySchema("Root", "", "User")}
                ${gts.entityQuerySchema("Root", "", "User*")}
            }
            type User {
                ${gts.attrIdSchema()}
                email: String
                firstName: String
                lastName: String
                ${gts.entityCloneSchema("User")}
                ${gts.entityCreateSchema("User")}
                ${gts.entityUpdateSchema("User")}
                ${gts.entityDeleteSchema("User")}
            }
        `;
    }

    static buildResolvers(gts): any {
        return {
            UUID: GraphQLToolsTypes.UUID({ name: "UUID", storage: "string" }),
            JSON: GraphQLToolsTypes.JSON({ name: "JSON" }),
            Root: {
                User:     gts.entityQueryResolver ("Root", "", "User"),
                Users:    gts.entityQueryResolver ("Root", "", "User*"),
            },
            User: {
                id:         gts.attrIdResolver      ("User"),
                clone:      gts.entityCloneResolver ("User"),
                create:     gts.entityCreateResolver("User"),
                update:     gts.entityUpdateResolver("User"),
                delete:     gts.entityDeleteResolver("User")
            }
        };
    }
}