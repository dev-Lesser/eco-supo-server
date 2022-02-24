import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credential.dto";
import { User } from "./user.entity";
import * as bcrypt from 'bcryptjs'
@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async createUser(authCredentialsDto: AuthCredentialsDto): Promise <User> {
        const { username, password } = authCredentialsDto;

        const salt = await bcrypt.genSalt(); // salt 생성
        const hashedPassword = await bcrypt.hash(password, salt); // hash화

        const user = this.create({
            username,
            password: hashedPassword
        })
        try {
            await this.save(user);
        } catch (err) {
            if (err.code === '23505') { // unique duplicate code
                throw new ConflictException('Existing username');
            } else {
                throw new InternalServerErrorException();
            }
        }
        
        return user;
    }
}
