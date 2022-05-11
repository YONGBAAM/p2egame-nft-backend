import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("Transaction")
export class Transaction {
    @PrimaryColumn()
    transactionId: string;

    @Column()
    walletAddress: string;

    @Column()
    transactionType: string; // Enum? "deposit", "withdrawal"

    @Column("jsonb", { nullable: true })
    actionInfo: object; // callback function infos. ""

    @Column() // what is default type of enums?
    status: string; // 'submitted', 'completed', "invalid",

    @Column('int', { default: -1 })
    blockCount: number = -1; // default value?

    @Column("jsonb", { nullable: true })
    others: object;
}

// TODO: Apply this
// // https://engineering.linecorp.com/ko/blog/typescript-enum-tree-shaking/
// const TRANSACTION_STATUS = {
//     SUBMITTED: 'submitted',
//     COMPLETED: 'completed'
// } as const;
// export type TRANSACTION_STATUS = typeof TRANSACTION_STATUS[keyof typeof TRANSACTION_STATUS];

// const TRANSACTION_TYPE = {
//     TO_NFT: 'to_nft',
//     TO_GAME: 'to_game'
// } as const;
// export type TRANSACTION_TYPE = typeof TRANSACTION_TYPE[keyof typeof TRANSACTION_TYPE];
