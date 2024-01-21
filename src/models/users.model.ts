// user.model.ts

interface UserModel {
    _id: string;
    username: string;
    type: string;
    name: string;
    lastName: string;
    email: string;
    token?: string;
    lineId?: string;
    image: string;

}

const initialProfile: UserModel = {
    _id: "",
    username: "",
    type: "",
    name: "",
    lastName: "",
    email: "",
    image: "",
    token: "",
};


export { initialProfile };
export type { UserModel };
