import { model, Schema} from "mongoose";

const messageSchema = new Schema({
    content: String,
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
})

export const MessageModel = model('Message',messageSchema) 