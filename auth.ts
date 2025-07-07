import { getServerSession } from "next-auth";
import { authOptions } from "./lib/authOptions";

export const auth = () => getServerSession(authOptions);