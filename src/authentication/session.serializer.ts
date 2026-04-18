/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { RepositoryService } from "./repository.service";

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private userRepo: RepositoryService) {
        super();
    }

    serializeUser(user: any, done: Function) {
        done(null, user.id);
    }

    async deserializeUser(userId: number, done: Function) {
        const user = await this.userRepo.findById(userId);
        done(null, user);
    }  
}
