import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import init from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/PostResolver";
import { UserResolver } from "./resolvers/UserResolver";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import CookieParser from 'cookie-parser'

const main = async () => {
  const orm = await MikroORM.init(init);
  await orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();
  // set up the cors
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  // setting the session and the redis
  app.use(
    session({
      name: "qid",
      store: new RedisStore({ client: redisClient, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: __prod__,
        sameSite: "lax",
      },
      secret: "my secret",
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use(CookieParser())

  // generate the apollo server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      em: orm.em,
      req,
      res,
    }),
  });

  app.get("/hello", (req, res) => {
    res.send("route for hello");
  });

  apolloServer.applyMiddleware({
    app,
    cors: { origin: "http://localhost:3000" },
  });

  app.listen("5000", () => {
    console.log("The express is ready 🚀");
  });
};

main();
