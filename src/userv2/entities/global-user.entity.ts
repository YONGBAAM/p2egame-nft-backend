import {PrimaryColumn, Column,OneToMany, Entity} from "typeorm"
import { LocalUser } from "./local-user.entity";

@Entity()
export class GlobalUser {
  @PrimaryColumn()
  walletAddress:string;

  @OneToMany( () => LocalUser, localUser => localUser.globalUser)
  localUsers:LocalUser[];

  @Column("jsonb", {nullable:true})
  others:object;
  

}