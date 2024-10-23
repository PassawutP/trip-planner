import { Body, Controller, Get, HttpException, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpDto } from './dto/signUp.dto';
import { Public } from 'src/auth/guard/public.decorator';
import mongoose from 'mongoose';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService){}

    // Sign up
    @Public()
    @Post('/signup')
    async signUp(@Body() signUpDto: SignUpDto){
        console.log(signUpDto.preferences);
        return this.usersService.signUp(signUpDto);
    }

    // Edit preference
    @Patch(':id')
    async editPreference(@Param('id') id: string, @Body() preferences: String[]){
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid ID', 400);
        return this.usersService.patchUserPreference(id, preferences);
    }

}

