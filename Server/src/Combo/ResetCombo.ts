import { BAD_REQUEST, OK } from "http-status-codes";
import mongoose from "mongoose";
import FormetResponseSend from "../util/FormetResponseSend";
import { Response } from "express";
import FormetResponseErrorSend from "../util/FormetResponseErrorSend";
import ComboModel from "./Combo.model";
import { ExtraTaskModel } from "../ExtraTask/ExtraTask.model";

export const ResetCombo = async (req: any, res: Response) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const result = await ExtraTaskModel.deleteMany({ category: 'combo' });
        console.log(result);

        await session.commitTransaction();
        session.endSession();

        return res.status(OK).send(FormetResponseSend(OK, "All Combo Track Deleted!", result));
    } catch (error) {
        await session.abortTransaction(); 
        session.endSession();
        if (error instanceof Error) {
            return res.status(BAD_REQUEST).send(FormetResponseErrorSend(BAD_REQUEST, error.message, error));
        }
    }
};

