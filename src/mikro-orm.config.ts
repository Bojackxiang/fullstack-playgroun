import Post from "./entitlies/Post";
import path from "path";
import { __prod__ } from "./constants";
import { MikroORM } from "@mikro-orm/core";

export default {
  migrations: {
    path: path.join(__dirname, "/.migrations"),
    pattern: /^[\w-]+\d+\.ts$/,
  },
  entities: [Post],
  dbName: "alexreddit",
  type: "postgresql",
  user:"postgres",
  password: "911004",
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
