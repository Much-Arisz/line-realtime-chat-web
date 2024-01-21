// user.model.ts
import { UserModel } from "./users.model";

interface UserMessageModel extends UserModel {
    message: Array<{
        _id: string;
        contactId: string;
        contactName: string;
        channel: string;
        senderId: string;
        senderType: string;
        senderName: string;
        dateTime: string;
        messageType: string;
        detail: string;
    }>;
}

const initialUserMessage: UserMessageModel =  {
    _id: "",
    username: "",
    type: "",
    name: "",
    lastName: "",
    email: "",
    token: "",
    lineId: "",
    image: "",
    message: []
};


export { initialUserMessage };
export type { UserMessageModel };
