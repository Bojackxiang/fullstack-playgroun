import { Resolver, Query, Ctx, Int, Arg, Mutation } from "type-graphql";
import { EntityManager, Connection, IDatabaseDriver } from "@mikro-orm/core";
import Post from "../entitlies/Post";

type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
};

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  listPosts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  async fineOnePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    return await em.findOne(Post, { id });
  }

  @Mutation(() => Post, { nullable: true })
  async createPost(
    @Arg("title", () => String) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.create(Post, { title });
    await em.persistAndFlush(post); // 应该是等待数据更新的作用。。。
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("title", () => String) title: string,
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ) {
    if (!title) return null;
    const post = await em.findOne(Post, { id });
    if (!post) return null;
    post.title = title;
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Boolean, { nullable: true })
  async deletePost(@Arg("id", () => Int) id: number, @Ctx() { em }: MyContext) {
    try {
      if (!id) throw "No ID Provided";
      await em.nativeDelete(Post, { id });
    } catch (error) {
      return false;
    }
    await em.nativeDelete(Post, { id });
    return true;
  }
}
