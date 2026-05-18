import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {
    
    private readonly allowedRoles: string[];

    constructor(...roles: string[]){
        this.allowedRoles = roles;
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !this.allowedRoles.includes(user.role)) {
            throw new ForbiddenException("Nemate dozvole za ovu akciju.");
        }

        return true;
    }

}
