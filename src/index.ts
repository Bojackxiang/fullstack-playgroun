import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entitlies/Post";
import path from "path";

const init = {
  migrations: {
    path: path.join(__dirname, "/.migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post],
  dbName: "lireddit",
  type: "postgresql",
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];

const main = async () => {
  const orm = await MikroORM.init(init);

  const post = orm.em.create(Post, { title: "My first post" });
  await orm.em.persistAndFlush(post);
  // await orm.em.nativeInsert(post);
};

main();

console.log("hello World");
