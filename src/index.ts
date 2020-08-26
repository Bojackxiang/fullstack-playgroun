import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
// import { Post } from "./entitlies/Post";
import init from "./mikro-orm.config";
import express from "express"
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";


const main = async () => {
  const orm = await MikroORM.init(init);
  await orm.getMigrator().up();
  // const post = orm.em.create(Post, { title: "My Second post" });
  // await orm.em.persistAndFlush(post);

  // const data = await orm.em.find(Post, {})
  // console.log(data);

  const app = express(); 

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false, 
    })
  })

  apolloServer.applyMiddleware({app})

  app.listen("4000", () => {
    console.log('The express is ready 🚀');
  })
};

main();

console.log("hello World");
