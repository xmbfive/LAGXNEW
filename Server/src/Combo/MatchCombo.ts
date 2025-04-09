import { BAD_REQUEST, OK } from "http-status-codes";
import mongoose from "mongoose";
import FormetResponseSend from "../util/FormetResponseSend";
import FormetResponseErrorSend from "../util/FormetResponseErrorSend";
import ComboModel from "./Combo.model";
import PointModel from "../Point/Point.model";
import { ExtraTaskModel } from "../ExtraTask/ExtraTask.model";
import { Request, Response } from "express";

export const MatchCombo = async (req: any, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { combo } = req.body;
        const userId = req?.user?.user?._id;

        const rewardPoints = Number(process.env.CURRECT_COMBO_REWARDS || 0);
        const point = await PointModel.findOne({ userId }).session(session);
        if (!point) {
            throw new Error("User's point record not found.");
        }

        await ExtraTaskModel.create(
            [
                {
                    userId,
                    pointId: point._id,
                    category: "combo",
                    point: rewardPoints,
                    title: "Combo Rewards",
                },
            ],
        );

        if (!Array.isArray(combo) || combo.length === 0) {
            throw new Error("Invalid or empty combo list provided.");
        }

        const existingTask = await ExtraTaskModel.findOne({ userId, category: "combo" }).session(session);
        if (existingTask) {
            throw new Error("User has already completed this task.");
        }

        for (let index = 0; index < combo.length; index++) {
            const { url } = combo[index];
            const foundCombo = await ComboModel.findOne({ image: url }).session(session);

            if (!foundCombo) {
                throw new Error(`Combo with image URL "${url}" not found.`);
            }

            if (Number(foundCombo.sort) !== index + 1) {
                throw new Error(`Sorting mismatch at position ${index + 1}.`);
            }
        }


        point.point += rewardPoints;
        await point.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res
            .status(OK)
            .send(FormetResponseSend(OK, "Combo list matches successfully!", { success: true }));
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        return res
            .status(BAD_REQUEST)
            .send(FormetResponseErrorSend(BAD_REQUEST, errorMessage, error));
    }
};
