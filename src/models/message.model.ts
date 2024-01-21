// message.model.ts

interface MessageModel {
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
}
export type { MessageModel };
