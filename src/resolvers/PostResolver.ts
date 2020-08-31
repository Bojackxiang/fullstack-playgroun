import { Resolver, Query, Ctx } from "type-graphql";
import { EntityManager, Connection, IDatabaseDriver } from "@mikro-orm/core";
import Post from "../entitlies/Post";

type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
};

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  listPosts(@Ctx() { em }: MyContext) {
    return em.find(Post, {});
  }
}
