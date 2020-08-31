import {
  Resolver,
  Query,
  Ctx,
  Mutation,
  Arg,
  InputType,
  Field,
  ObjectType,
  Int,
} from "type-graphql";
import User from "../entitlies/User";
import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import argon2 from "argon2";

type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
};

@InputType()
class UserNamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class UserResponse {
  @Field(() => String, { nullable: true })
  error?: String;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => Int, { nullable: false })
  code: Number;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async listUsers(@Ctx() { em }: MyContext) {
    return em.find(User, {});
  }

  @Mutation(() => Boolean)
  async createUser(
    @Arg("options", () => UserNamePasswordInput) options: UserNamePasswordInput,
    @Ctx() { em }: MyContext
  ) {
    try {
      const { username, password } = options;
      if (!username || !password) {
        throw "Username and password are required";
      }

      const hashedPassword = await argon2.hash(options.password);

      const user = em.create(User, {
        username: options.username.toLowerCase(),
        password: hashedPassword,
      });

      await em.persistAndFlush(user);
      return true;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }

  @Mutation(() => UserResponse)
  async userLogin(
    @Arg("options", () => UserNamePasswordInput) options: UserNamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    try {
      if (!options.username || !options.password) {
        throw "Must provide user name and password to login";
      }

      const user = await em.findOne(User, {
        username: options.username.toLowerCase(),
      });

      if (!user) {
        return {
          error: "Did not find the user",
          code: -1,
        };
      }

      if (!(await argon2.verify(user.password,  options.password))) {
        return {
          error: "Password is not correct",
          code: -1,
        };
      }

      return {
        user,
        code: 1,
      };
    } catch (error) {
      return {
        error: error.message,
        code: -1,
      };
    }
  }
}

export default UserResolver;
