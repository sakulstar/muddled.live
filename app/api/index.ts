import { GetSubmissionsOptions } from "./_internal/muddled";
import {
    Submission as ISubmission,
    SubmissionsResponse,
} from "./_internal/muddled/submissions_pb";
import { type AuthOptions, getServerSession, Session } from "next-auth";
import Twitch from "next-auth/providers/twitch";

import { DefaultUser } from "next-auth";
declare module "next-auth" {
    interface Session {
        user?: DefaultUser & {
            id: string;
            role: number;
        };
    }
    interface User extends DefaultUser {
        role: number;
    }
}

export type Submission = ISubmission.AsObject & {
    isMuted: boolean;
};
export type Submissions = Submission[];

const ADMINS = ["CrimpsOnSloper", "ttlnow"];

export type User = {
    name: string;
    email: string;
    image: string;
};

export const authOptions: AuthOptions = {
    providers: [
        Twitch({
            clientId: process.env.TWITCH_CLIENT_ID as string,
            clientSecret: process.env.TWITCH_CLIENT_SECRET as string,
        }),
    ],
};

export const likeVideo = (id: number) =>
    fetch(`/api/videos/${id}/like`, { method: "PATCH" });

export const muteMember = (chatter: string) =>
    fetch(`/api/members/${chatter}/mute`, { method: "PATCH" });

export const getSubmissions = async (
    opt?: Partial<GetSubmissionsOptions>,
): Promise<SubmissionsResponse.AsObject> => {
    const query = new URLSearchParams();
    if (opt) {
        Object.entries(opt).forEach(([k, v]) => query.set(k, v.toString()));
    }
    return fetch(`/api/submissions?` + query).then((r) => r.json());
};

export const getUser = async (): Promise<User | null> => {
    const session = await getServerSession(authOptions);
    const user = session?.user as User | undefined;
    return user ?? null;
};
