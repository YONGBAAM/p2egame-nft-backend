import { ItemV2 } from "src/itemv2/entities/itemv2.entity";
import {ManyToOne, Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn,OneToMany,JoinColumn} from "typeorm"
import { GlobalUser } from "./global-user.entity";

@Entity()
export class LocalUser {
  @PrimaryColumn()
  walletAddress:string;

  @PrimaryColumn()
  contract:string;

  @OneToMany( () =>  ItemV2, item => item.user)
  @JoinColumn([
    {name: "contract", referencedColumnName:"contract"},
  ])
  items:ItemV2[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToOne( () => GlobalUser, user => user.localUsers)
  @JoinColumn({name:'walletAddress'})
  globalUser:GlobalUser;
  
}
