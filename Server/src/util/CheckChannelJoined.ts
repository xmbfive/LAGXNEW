import { Request, Response } from "express";
import { SettingModel } from "../Setting/Setting.Model";

export const CheckChannelJoin = async (req: Request, res: Response) => {
    try {
        const { channel, user_id } = req?.query;
        const document = await SettingModel.findOne({});
        console.log(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getChatMember?chat_id=@${channel}&user_id=${user_id}`);

        fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getChatMember?chat_id=@${channel}&user_id=${user_id}`)
            .then(res => res.json())
            .then(data => {

                if (data?.ok === false || data?.result?.status === 'left' || data?.result?.status === 'kicked') {
                    return res.status(200).send({
                        msg: 'User channel status fetched!',
                        data: {
                            user_id,
                            join: false
                        },
                        statusCode: 200
                    });
                } else {
                    return res.status(200).send({
                        msg: 'User channel status fetched!',
                        data: {
                            user_id,
                            join: true
                        },
                        statusCode: 200
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching user channel status:', error);
                return res.status(500).send({
                    msg: 'Error fetching user channel status',
                    statusCode: 500
                });
            });

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
