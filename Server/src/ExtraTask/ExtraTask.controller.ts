import { Request, Response } from "express";
import { BAD_REQUEST, OK } from "http-status-codes";
import FormetResponseErrorSend from "../util/FormetResponseErrorSend";
import UserModel from "../User/User.model";
import { TUser } from "../User/User.interface";
import mongoose from "mongoose";
import PointModel from "../Point/Point.model";
import { ExtraTaskModel } from "./ExtraTask.model";
import FormetResponseSend from "../util/FormetResponseSend";
import { bot } from "../app";
import { TExtraTask } from "./ExtraTask.interface";
import { SettingModel } from "../Setting/Setting.Model";

export const TonTransection = async (req: any, res: Response) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { user: authUser }: { user: TUser } = req?.user;
        const user = await UserModel.findById(authUser?._id).session(session);
        const point = await PointModel.findOne({ userId: user?._id }).session(session);
        const setting = await SettingModel.findOne({}).session(session);
        const transection = await ExtraTaskModel.findOne({
            title: "Ton Transection",
            userId: user?._id,
            pointId: point?._id
        });

        if (transection?._id) {
            throw new Error("User already did ton transection!");
        }

        if (!user?._id) {
            throw new Error("User not exist!");
        }
        if (!point?._id) {
            throw new Error("Point info not located!");
        }

        // point.point = Number(point?.point) + Number(setting?.TonTranPoint ? setting?.TonTranPoint : 0);
        // await point.save({ session: session });

        // const task = await ExtraTaskModel.create([{
        //     title: "Ton Transection",
        //     point: setting?.TonTranPoint ? setting?.TonTranPoint : 0,
        //     userId: user?._id,
        //     pointId: point?._id,
        //     category: 'transection'
        // }], { session: session });

        await session.commitTransaction();
        await session.endSession();

        return res.status(OK).send(FormetResponseSend(OK, "Ton Transection Complete", "task[0]"));
    } catch (error) {
        console.log(error);

        if (error instanceof Error) {
            return res.status(BAD_REQUEST).send(FormetResponseErrorSend(BAD_REQUEST, error.message, error));
        }
    }
}

export const InviteTask = async (req: any, res: Response) => {
    const session = await mongoose.startSession();
    const { user: authUser }: { user: TUser } = req?.user;
    try {
        session.startTransaction();
        const refer_count = Number(req?.body?.refer_count);

        let rewards = 0;

        switch (refer_count) {
            case 3:
                rewards = 500;
                break;
            case 10:
                rewards = 1000;
                break;
            case 25:
                rewards = 2500;
                break;
            case 50:
                rewards = 5000;
                break;
            case 100:
                rewards = 10000;
                break;
            default:
                rewards = 0;
                break;
        }

        if (refer_count) {
            const user = await UserModel.findById(authUser?._id).session(session);
            const point = await PointModel.findOne({ userId: authUser?._id }).session(session);
            const referCount = await UserModel.find({ referBy: authUser?.ReferCode }).session(session);
            const isDid = await ExtraTaskModel.findOne({
                title: `Refer ${refer_count}`,
                userId: user?._id,
                pointId: point?._id,
                point: rewards
            })

            if (referCount.length >= refer_count) {
                if (point?._id) {
                    point.point = point?.point + rewards;
                    await point.save({ session: session });
                }

                if (isDid?._id) {
                    throw new Error("Already Claim Refer Rewards!");
                }
                await ExtraTaskModel.create([{
                    title: `Refer ${refer_count}`,
                    userId: user?._id,
                    pointId: point?._id,
                    point: rewards,
                    category: 'refer'
                }], { session: session });


                await session.commitTransaction();
                await session.endSession();
                await bot.telegram.sendMessage(Number(user?.TgId), `🎉 Thank you for referring ${refer_count} amazing people!
We truly appreciate the relationship we've built with you, and it's wonderful to see how you've shared that by bringing others onboard! 🌟\n\n🤝 Thanks again for your support, and remember: the more you refer, the more rewards you can earn! Keep up the great work! 💪`);
                return res.send({
                    msg: 'Invite completed!',
                    statusCode: 200,
                    data: []
                })
            } else {


                await session.abortTransaction();
                await session.endSession();

                await bot.telegram.sendMessage(Number(user?.TgId), `🚨 Uh-oh! Looks like you're almost there, but not quite yet!\nYou still need to refer at least ${Number(refer_count) - referCount?.length} more friends before you can claim your awesome rewards. 🌟\n\n\n🎯 Keep going! You're so close to achieving your goal!`);

                res.status(200).send({
                    data: [],
                    statusCode: 500,
                    msg: `Not completed ${refer_count} invite`
                });
            }
        } else {
            throw new Error("I am not sure what i do!");
        }
    } catch (error) {
        // await session.abortTransaction();
        // await session.endSession();
        if (error instanceof Error) {
            res.status(200).send({
                data: [],
                statusCode: 500,
                msg: error.message
            });
        }
    }
}

export const ExtraTaskCompleteList = async (req: any, res: Response) => {
    try {
        const { user } = req?.user;
        const refer_count = await UserModel.find({ referBy: user?.ReferCode });
        const media = await SettingModel.findOne({});
        const transection = await ExtraTaskModel.findOne({
            userId: user?._id,
            title: "Ton Transection"
        });

        const refer = await ExtraTaskModel.find({
            userId: user?._id,
            title: { $ne: "Ton Transection" }
        });

        const referlist = refer?.map((item) => {
            return item?.title.includes("Refer") ? {
                refer: item?.title?.split("Refer")[1].trim()
            } : null
        });

        const referF = referlist.filter((item) => item !== null);

        return res.status(OK).send(FormetResponseSend(OK, "Extra Task Complete List", { media: media?.StatusMedia, refer: referF, trans: transection, refer_count: refer_count?.length ? refer_count?.length : 0 + 1 }));
    } catch (error) {
        console.log(error);

        if (error instanceof Error) {
            return res.status(BAD_REQUEST).send(FormetResponseErrorSend(BAD_REQUEST, error.message, error));
        }
    }
}

export const DailyChecking = async (req: any, res: Response) => {
    const session = await mongoose.startSession();
    const { user: authUser }: { user: TUser } = req?.user;
    try {
        session.startTransaction();

        const point = await PointModel.findOne({ userId: authUser?._id });
        if (!point?._id) {
            throw new Error("Point is not found!");
        }

        const checking = await ExtraTaskModel.findOne({
            title: "Daily Checking",
            userId: authUser?._id
        }).sort("-createdAt").session(session);

        const currentDate = new Date();
        const lastCheckingDate = checking ? new Date(checking.createdAt as string).getTime() : 0;

        // Calculate the next claimable time (next day at 12:01 AM)
        const nextClaimTime = new Date(new Date(lastCheckingDate).setDate(new Date(lastCheckingDate).getDate() + 1));
        nextClaimTime.setHours(0, 1, 0, 0); // Set time to 12:01 AM of the next day

        // If no check today or it's past 12:01 AM the next day, allow claiming
        if (!checking || currentDate.getTime() >= nextClaimTime.getTime()) {
            const accountCreationDate = new Date(authUser?.createdAt);
            const accountAgeInDays = Math.floor((currentDate.getTime() - accountCreationDate.getTime()) / (1000 * 60 * 60 * 24));

            // Determine points to add based on account age
            let additionalPoints = 0;
            if (accountAgeInDays === 1) {
                additionalPoints = 69;
            } else if (accountAgeInDays === 2) {
                additionalPoints = 150;
            } else if (accountAgeInDays === 3) {
                additionalPoints = 300;
            } else if (accountAgeInDays === 4) {
                additionalPoints = 6000;
            } else if (accountAgeInDays === 5) {
                additionalPoints = 800;
            } else if (accountAgeInDays >= 6) {
                additionalPoints = 1200;
            }

            // Add points to the user's total
            point.point = Number(point.point) + additionalPoints;
            await point.save({ session });

            await ExtraTaskModel.create([{
                title: "Daily Checking",
                category: "checking",
                point: additionalPoints,
                pointId: point?._id,
                userId: authUser?._id
            }], { session });
        } else {
            throw new Error("You have already claimed your daily points. Please try again after 12:01 AM tomorrow.");
        }

        await session.commitTransaction();
        session.endSession();

        res.status(200).send({
            data: [],
            statusCode: 200,
            msg: "Daily checking successful!",
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        if (error instanceof Error) {
            res.status(200).send({
                data: [],
                statusCode: 500,
                msg: error.message
            });
        }
    }
};


export const HasClaimedToday = async (req: any, res: Response) => {
    const { user: authUser }: { user: TUser } = req?.user;

    try {
        const today = new Date();
        today.setHours(0, 1, 0, 0); // Set time to 12:01 AM today

        // Calculate account age in days
        const accountCreationDate = new Date(authUser.createdAt);
        const accountAgeInDays = Math.floor((new Date().getTime() - accountCreationDate.getTime()) / (1000 * 60 * 60 * 24));

        // Check if user has claimed today
        const lastChecking = await ExtraTaskModel.findOne({
            title: "Daily Checking",
            userId: authUser?._id
        }).sort("-createdAt");

        if (!lastChecking || new Date(lastChecking.createdAt as string).getTime() < today.getTime()) {
            return res.status(200).send({
                hasClaimed: false,
                age: accountAgeInDays,
                msg: "User has not claimed the reward since 12:01 AM today."
            });
        }

        return res.status(200).send({
            hasClaimed: true,
            age: accountAgeInDays,
            msg: "User has already claimed the reward today."
        });

    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send({
                hasClaimed: false,
                age: null, // Fallback in case of an error
                msg: error.message
            });
        }
    }
};


export const DailyStory = async (req: any, res: Response) => {
    const session = await mongoose.startSession();
    const { user: authUser }: { user: TUser } = req?.user;
    try {
        session.startTransaction();

        const point = await PointModel.findOne({ userId: authUser?._id });
        if (!point?._id) {
            throw new Error("point is not found!");
        }

        const checking = await ExtraTaskModel.findOne({
            title: "Daily Story",
            userId: authUser?._id
        }).sort("-createdAt").session(session);

        const currentDate = new Date();
        const lastCheckingDate = checking ? new Date(checking.createdAt as string).getTime() : 0;

        const nextClaimTime = new Date(new Date(lastCheckingDate).setDate(new Date(lastCheckingDate).getDate() + 1));
        nextClaimTime.setHours(0, 1, 0, 0);

        if (!checking || currentDate.getTime() >= nextClaimTime.getTime()) {
            point.point = Number(point.point) + Number(process.env.STORY_REWARDS);
            await point.save({ session });

            await ExtraTaskModel.create([{
                title: "Daily Story",
                category: "story",
                point: Number(process.env.STORY_REWARDS),
                pointId: point?._id,
                userId: authUser?._id
            }], { session });
        } else {
            throw new Error("You have already claimed your daily story points. Please try again after 12:01 AM tomorrow.");
        }

        await session.commitTransaction();
        session.endSession();

        res.status(200).send({
            data: [],
            statusCode: 200,
            msg: "Daily story checking successful!",
        });
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        if (error instanceof Error) {
            res.status(200).send({
                data: [],
                statusCode: 500,
                msg: error.message
            });
        }
    }
};


export const HasClaimedTodayStory = async (req: any, res: Response) => {
    const { user: authUser }: { user: TUser } = req?.user;

    try {
        // Calculate today's 12:01 AM
        const today = new Date();
        today.setHours(0, 1, 0, 0); // Set time to 12:01 AM of today

        // Fetch the user's latest "Daily Checking" task
        const lastChecking = await ExtraTaskModel.findOne({
            title: "Daily Story",
            userId: authUser?._id
        }).sort("-createdAt");

        // If there's no check or it's before today 12:01 AM, return false
        if (!lastChecking || new Date(lastChecking.createdAt as string).getTime() < today.getTime()) {
            return res.status(200).send({
                hasClaimed: false,
                msg: "User has not claimed the reward since 12:01 AM today."
            });
        }

        // If the last claim was after today 12:01 AM
        return res.status(200).send({
            hasClaimed: true,
            msg: "User has already claimed the reward today."
        });

    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send({
                hasClaimed: false,
                msg: error.message
            });
        }
    }
};

export const HasUserTonTransectioned = async (req: any, res: Response) => {
    const session = await mongoose.startSession();
    const { user: authUser }: { user: TUser } = req?.user;
    try {
        session.startTransaction();

        const point = await PointModel.findOne({ userId: authUser?._id });
        if (!point?._id) {
            throw new Error("point is not found!");
        }

        const transection = await ExtraTaskModel.findOne({
            title: "Ton Transection",
            userId: authUser?._id,
            pointId: point?._id
        });


        await session.commitTransaction();
        session.endSession();

        res.status(200).send({
            data: transection,
            statusCode: 200,
            msg: "Ton Transection is retrived!",
        });
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        if (error instanceof Error) {
            res.status(200).send({
                data: [],
                statusCode: 500,
                msg: error.message
            });
        }
    }
};

async function pointTrack(category: string, array: TExtraTask[]) {
    let point = 0;
    await array.map(item => {
        if (item?.category === category) {
            point += Number(item?.point);
        }
    });

    return point ? point : 0;
}

export const PointTracking = async (req: any, res: Response) => {
    const session = await mongoose.startSession();
    const { user: authUser }: { user: TUser } = req?.user;
    try {
        session.startTransaction();

        const tracking = await ExtraTaskModel.find({
            userId: authUser?._id
        });

        const checkin = await pointTrack("checking", tracking);
        const refer = await pointTrack("refer", tracking);
        const transection = await pointTrack("transection", tracking);
        const story = await pointTrack("story", tracking);
        const farming = await pointTrack("farming", tracking);
        const task = await pointTrack("task", tracking);

        await session.commitTransaction();
        session.endSession();

        res.status(200).send({
            data: { checkin, refer, transection, story, farming, task },
            statusCode: 200,
            msg: "History!",
        });
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        if (error instanceof Error) {
            res.status(200).send({
                data: [],
                statusCode: 500,
                msg: error.message
            });
        }
    }
};

