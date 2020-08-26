import { Resolver, Query } from "type-graphql";
import { Post } from "src/entitlies/Post";


@Resolver()
export class HelloResolver {
    @Query(() => [Post])
    hello(){
        return 'hello world'
    }
}