import { BAD_REQUEST, OK } from "http-status-codes";
import mongoose from "mongoose";
import FormetResponseSend from "../util/FormetResponseSend";
import { Response } from "express";
import FormetResponseErrorSend from "../util/FormetResponseErrorSend";
import ComboModel from "./Combo.model";

export const CreateCombo = async (req: any, res: Response) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const body = req?.body;
        const index = await ComboModel.find({}).session(session);
        const object = {
            ...body,
            index: index.length + 1
        }
        const creation = await ComboModel.create([object], { session });
        await session.commitTransaction();
        await session.endSession();
        return res.status(OK).send(FormetResponseSend(OK, "New Combo Created!", creation));
    } catch (error) {
        if (error instanceof Error) {
            return res.status(BAD_REQUEST).send(FormetResponseErrorSend(BAD_REQUEST, error.message, error));
        }
    }
}
