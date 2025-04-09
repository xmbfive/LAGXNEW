import { BAD_REQUEST, OK } from "http-status-codes";
import mongoose from "mongoose";
import FormetResponseSend from "../util/FormetResponseSend";
import { Response } from "express";
import FormetResponseErrorSend from "../util/FormetResponseErrorSend";
import ComboModel from "./Combo.model";

export const DeleteComboAdmin = async (req: any, res: Response) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const combo = req?.body?._id;
        const result = await ComboModel.findByIdAndDelete(combo).session(session);
        await session.commitTransaction();
        await session.endSession();
        return res.status(OK).send(FormetResponseSend(OK, "Combo Deleted!", result));
    } catch (error) {
        if (error instanceof Error) {
            return res.status(BAD_REQUEST).send(FormetResponseErrorSend(BAD_REQUEST, error.message, error));
        }
    }
}
