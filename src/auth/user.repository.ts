import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credential.dto";
import { User } from "./user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async createUser(authCredentialsDto: AuthCredentialsDto): Promise <User> {
        const { username, password } = authCredentialsDto;
        const user = this.create({
            username,
            password
        })
        try {
            await this.save(user);
        } catch (err) {
            if(err.code === '23505') { // unique duplicate code
                throw new ConflictException('Existing username');
            }else {
                throw new InternalServerErrorException();
            }
        }
        
        return user;
    }
}
