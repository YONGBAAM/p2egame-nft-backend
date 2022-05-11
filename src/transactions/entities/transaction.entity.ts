import { Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import {SolidityEvent} from "../dto/event"

/*
This is event-based transaciton object
One transaction can have several types of events, such as approval and transfer in ERC721 transfer. 
*/
@Entity("Transactions")
export class TransactionRecord {
    // @PrimaryColumn()
    // eventTransactionHash: string; // Transfer_0x....

    @PrimaryColumn()
    transactionHash:string;

    @PrimaryColumn()
    eventType:string; // Enum? "deposit", "withdrawal"

    @Column("jsonb", { nullable: true })
    event: SolidityEvent; // Consumed event

    @Column({ nullable: true })
    registeredFrom: string; // api call account

    @Column({ nullable: true })
    actionType:string; // Enum? "deposit", "withdrawal"

    @Column("int", { nullable: true })
    submitBlock:number;

    @Column()
    status:string;// 'submitted',"event", 'completed', "invalid", "error" // 블록카운트 비교해서

    @Column("jsonb", { nullable: true })
    others: SolidityEvent; // Consumed event
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
