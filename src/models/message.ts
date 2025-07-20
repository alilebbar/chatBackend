import mongoose, {Schema, Document} from "mongoose";

export interface IMessage extends Document {
    sender: string;
    content: string;
    timestamp: Date;
}

const messageSchema = new Schema<IMessage>({
    sender: { type: String, required:true},
    content: { type: String, required:true},
    timestamp: { type: Date, default: Date.now }
})
export default mongoose.model<IMessage>("Message", messageSchema);
