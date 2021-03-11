import * as Mongoose from "mongoose";

export const CategorySchema = new Mongoose.Schema({
    category: { type: String, unique:true },
    description: { type: String },
    events: [
        {
            name: { type: String },
            operation: { type: String },
            value: { type: String }
        }
    ],
    players: [{
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Player"
    }]
}, {
    timestamps: true, 
    collection: 'Category'
});