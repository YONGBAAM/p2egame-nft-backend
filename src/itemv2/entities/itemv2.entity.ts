import { LocalUser, LocalUser as UserV2 } from "src/userv2/entities/local-user.entity";
import {
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Column,
  ManyToOne,
  Entity
} from "typeorm"

@Entity()
export class ItemV2 {
  @PrimaryGeneratedColumn('uuid')
  uiid: string;

  @Column() // TODO: Contract is deduplicated so ignore one of those.
  contract: string;

  @Column()
  nftId: string;

  @Column("int", { default: 0 })
  count: number = 0;

  @ManyToOne(() => LocalUser, user => user.items)
  user: LocalUser;
}
