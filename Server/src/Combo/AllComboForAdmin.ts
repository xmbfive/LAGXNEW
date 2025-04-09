import { BAD_REQUEST, OK } from "http-status-codes";
import mongoose from "mongoose";
import FormetResponseSend from "../util/FormetResponseSend";
import { Response } from "express";
import FormetResponseErrorSend from "../util/FormetResponseErrorSend";
import ComboModel from "./Combo.model";

export const AllComboForAdmin = async (req: any, res: Response) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const result = await ComboModel.find({});
        await session.commitTransaction();
        await session.endSession();
        return res.status(OK).send(FormetResponseSend(OK, "All Combo List For Admin", result));
    } catch (error) {
        if (error instanceof Error) {
            return res.status(BAD_REQUEST).send(FormetResponseErrorSend(BAD_REQUEST, error.message, error));
        }
    }
}
