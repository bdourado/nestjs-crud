import { Document } from "mongoose";
import { Player } from "src/player/interfaces/player.interface";
import { challengeStatus } from "./challenge-status.enum";



export interface Challenge extends Document {
    challengeDateTine: Date;
    status: challengeStatus;
    requestDateTime: Date;
    responseDateTime: Date;
    requester: Player;
    category: string;
    players: Array<Player>;
    match: Match;
}

export interface Match extends Document{
    category: string;
    players: Array<Player>;
    def: Player,
    score: Array<Result> 
}

export interface Result {
    set: String;
}