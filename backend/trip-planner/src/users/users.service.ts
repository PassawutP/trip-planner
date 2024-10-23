
import { HttpException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/signUp.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/users.schema';

@Injectable()
export class UsersService {
  
    constructor(@InjectModel(User.name) private userModel: Model<User>){}

    async findOne(email: string): Promise<User | undefined> {
        return this.userModel.findOne({ email }).exec();
    }


    // sign up
    async signUp( signUpDto: SignUpDto ) : Promise<User>
    {
        const newUser =  new this.userModel(signUpDto);
        return newUser.save();
    }


    // edit preference
    async patchUserPreference( userId: string, preferences: String[] ) : Promise<User> 
    {
        return await this.userModel.findByIdAndUpdate(userId, preferences);
    }

}
