import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt"; // passport 가 아님
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";
import * as config from 'config'


@Injectable() // > 다른곳에서도 사용할 수 있게 데코레이션 넣음
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor (
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {
        super({
            secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'), // jwt 비교를 위한 값
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }   
    async validate(payload) {
        const {username} = payload;
        const user: User = await this.userRepository.findOne({username});
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }

}