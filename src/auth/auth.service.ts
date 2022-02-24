import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
        return this.userRepository.createUser(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        const {username, password} = authCredentialsDto;
        const user = await this.userRepository.findOne({username}); // username으로 찾는다

        if (user && (await bcrypt.compare(password, user.password))){
            // 유저 토큰 생성 (Secret + payload)
            const payload = { username } // username 만 넣어준다
            const accessToken = await this.jwtService.sign(payload); // secret 과 payload 를 합쳐서 생성해준다

            return { accessToken };
        }
        else {
            throw new UnauthorizedException('Login failed')
        }
    }

}
