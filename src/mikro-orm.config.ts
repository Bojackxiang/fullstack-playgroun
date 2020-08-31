import Post from "./entitlies/Post";
import path from "path";
import { __prod__ } from "./constants";
import { MikroORM } from "@mikro-orm/core";
import User from "./entitlies/User";


// postgres login commend 
// psql -U postgres -h localhost
export default {
  migrations: {
    path: path.join(__dirname, "/.migrations"),
    pattern: /^[\w-]+\d+\.ts$/,
  },
  entities: [Post, User],
  dbName: "alexreddit",
  type: "postgresql",
  user:"postgres",
  password: "911004",
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
