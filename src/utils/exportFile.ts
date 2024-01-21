import dayjs from "dayjs";
import { MessageModel } from "../models/message.model";
import { UserModel } from "../models/users.model";

const exportToCSV = (user: UserModel, chatMessages: MessageModel[]) => {
    // สร้างสตริงสำหรับข้อมูล CSV
    const contactName = user.name;
    const csvRows = [
        ['Contact name', 'Channel', 'Export date', '', '', ''],
        [contactName, 'Line', dayjs().format('DD/MM/YYYY HH:mm'), '', '', ''],
        [''],
        ['Sender type', 'Sender name', 'Date', 'Time', 'Message'],
    ];


    chatMessages.forEach((msg) => {
        const detail = msg.messageType === "text" ? msg.detail : "(Picture)"
        const date = dayjs(msg.dateTime).format('DD/MM/YYYY');
        const time = dayjs(msg.dateTime).format('HH:mm');
        csvRows.push([
            msg.senderType,
            msg.senderName,
            date,
            time,
            detail,
        ]);
    });

    const csvString = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-history-${contactName}-${dayjs().format('YYYYMMDDHHmmss')}.csv`;
    link.click();

    // ทำความสะอาด URL หลังจากดาวน์โหลด
    URL.revokeObjectURL(url);
};

export default exportToCSV;