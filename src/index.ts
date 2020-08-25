import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entitlies/Post";
import init from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(init);
  await orm.getMigrator().up();
  const post = orm.em.create(Post, { title: "My first post" });
  await orm.em.persistAndFlush(post);
  // await orm.em.nativeInsert(post);
};

main();

console.log("hello World");
