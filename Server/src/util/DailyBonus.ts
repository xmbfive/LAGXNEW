import { Request, Response } from "express";

export const DailyBonus = async (req: Request, res: Response) => {
    try {

    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).send({
                msg: error.message,
                statusCode: 400
            });
        }
        return res.status(500).send('Something went wrong');
    }
};
