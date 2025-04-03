/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { ApproveUserDto } from './dto/approve-user.dto';
import { Roles } from 'shared/roles.decorator';
import { Role } from 'shared/role.enum';
import { EditUserDto } from './dto/edit-user.dto';
import { AllUsersDto } from './dto/all-users.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { JwtAuthGuard } from 'shared/jwt-auth.guard';
import { RolesGuard } from 'shared/roles.guard';
import { RegisterDto } from './dto/register.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth('x-access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly authService: UsersService) {}

  @Post('signUp')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async register(@Body() registerDto: RegisterDto, @Req() req) {
    return this.authService.register(registerDto, req.user);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('terms')
  async terms(@Body() emailDto: EditUserDto) {
    return this.authService.terms(emailDto);
  }

  @Post('approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async approveUser(@Body() approveUserDto: ApproveUserDto) {
    return this.authService.approveUser(approveUserDto);
  }

  @Post('edit')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async editUser(@Body() editUserDto: EditUserDto) {
    return this.authService.editUser(editUserDto);
  }

  @Post('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getAllUsers(@Body() allUsersDto: AllUsersDto) {
    return this.authService.getAllUsers(allUsersDto);
  }

  @Post('reset-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async deleteUser(@Body() deleteUserDto: DeleteUserDto) {
    return this.authService.deleteUser(deleteUserDto);
  }

  @Get('refresh-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async refreshToken(@Req() req) {
    return this.authService.refreshToken(req.user);
  }
}
