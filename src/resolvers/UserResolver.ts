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
import argon2 from "argon2";
import { MyContext } from "../../types/MyContext";

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
  async listUsers(@Ctx() { em, req }: MyContext) {
    return em.find(User, {});
  }

  @Query(() => UserResponse)
  async me(@Ctx() { em, req }: MyContext) {
    console.log(req.session);
    if (req.session.userId) {
      const user = await em.findOne(User, { id: req.session.userId });
      return {
        code: 1,
        user,
      };
    }
    return {
      code: -1,
      error: "Please login ",
    };
  }

  @Mutation(() => UserResponse)
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

      return {
        user: user,
        code: 1,
      };
    } catch (error) {
      return {
        error: `${error.name} - ${error.detail}`,
        code: -1,
      };
    }
  }

  @Mutation(() => UserResponse)
  async userLogin(
    @Arg("options", () => UserNamePasswordInput) options: UserNamePasswordInput,
    @Ctx() { em, req, res }: MyContext
  ): Promise<UserResponse> {
    try {
      if (!options.username || !options.password) {
        throw "Must provide user name and password to login";
      }

      const user = await em.findOne(User, {
        username: options.username.toLowerCase(),
      });

      // there is no such a user
      if (!user) {
        return {
          error: "Did not find the user",
          code: -1,
        };
      }

      // if the password is no correct
      if (!(await argon2.verify(user.password, options.password))) {
        return {
          error: "Password is not correct",
          code: -1,
        };
      }

      // 下面的这个对于request的设定，其实就是之后程序往后短发程序后段所收到的数据
      req.session.userId = user.id; // !代表着这个session 一定不是 undefined
      req.session.test = 'alex is cool'

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
