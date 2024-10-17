import { User } from "../models/user.model";

declare global {
    namespace Express {
        interface Request {
            user?: User; // Adds the prop `user` globally
        }
    }
}