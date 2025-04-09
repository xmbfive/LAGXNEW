import { model, Schema } from "mongoose";
import { Combo } from "./Combo.interface";

const schema = new Schema<Combo>({
    index: {
        required: true,
        type: Number,
        unique: true
    },
    image: {
        required: true,
        type: String
    },
    sort: {
        required: true,
        type: String,
        enum: ["1", "2", "3", "no"]
    }
}, {
    timestamps: true
});

const ComboModel = model("combo", schema);

export default ComboModel;