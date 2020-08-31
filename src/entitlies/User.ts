/**
 * 每当创建了一个新的entity的时候，
 * 将其添加到mikro的config里面，
 * 然后
 * run一遍 
 * yarn create:migration
 * 最后check migration
 */
import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
@Entity()
class User {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field()
  @Property({ type: "text", unique: true })
  username!: string;

  @Property({ type: "text" })
  password!: string;
  // password 没有 field 意味着在graphql里面，这个是不能被选择出来的

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}

export default User;
