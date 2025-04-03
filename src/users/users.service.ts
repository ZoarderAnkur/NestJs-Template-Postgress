/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ApproveUserDto } from './dto/approve-user.dto';
import { EditUserDto } from './dto/edit-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { AllUsersDto } from './dto/all-users.dto';
import { ConfigService } from '@nestjs/config';
import { User } from 'shared/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { EMAIL, PASSWORD, NAME, PHONE_NUMBER, LOCATION } = signUpDto;

    const existingUser = await this.usersRepository.findOne({
      where: { EMAIL: EMAIL.toUpperCase(), FLAG: 'ACTIVE' },
    });

    if (existingUser) {
      throw new ConflictException('This email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(PASSWORD, salt);

    const newUser = this.usersRepository.create({
      NAME,
      EMAIL: EMAIL.toUpperCase(),
      PHONE_NUMBER,
      LOCATION,
      ROLE: 'UNKNOWN',
      PASSWORD: hashedPassword,
      EULA: false,
      VERIFIED: false,
      FLAG: 'ACTIVE',
    });

    const user = await this.usersRepository.save(newUser);
    if (user) {
      return {
        statusCode: 201,
        message: 'You have registered successfully',
      };
    } else {
      return {
        message: 'Database error',
        statusCode: 500,
      };
    }
  }
  async register(registerDto: RegisterDto, req: any) {
    const { EMAIL, PASSWORD, NAME, ROLE, PHONE_NUMBER, LOCATION } = registerDto;

    const existingUser = await this.usersRepository.findOne({
      where: { EMAIL: EMAIL.toUpperCase(), FLAG: 'ACTIVE' },
    });

    if (existingUser) {
      throw new ConflictException('This email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(PASSWORD, salt);

    const newUser = this.usersRepository.create({
      NAME,
      EMAIL: EMAIL.toUpperCase(),
      PHONE_NUMBER,
      LOCATION,
      ROLE,
      PASSWORD: hashedPassword,
      EULA: false,
      VERIFIED: true,
      FLAG: 'ACTIVE',
      CREATED_BY: req.EMAIL,
    });

    const user = await this.usersRepository.save(newUser);
    if (user) {
      return {
        statusCode: 201,
        message: 'User created successfully',
      };
    } else {
      return {
        message: 'Database error',
        statusCode: 500,
      };
    }
  }
  async login(loginDto: LoginDto) {
    const { EMAIL, PASSWORD } = loginDto;
    const email = EMAIL.toUpperCase();

    const user = await this.usersRepository.findOne({
      where: { EMAIL: email, FLAG: 'ACTIVE' },
      select: [
        'PASSWORD',
        'EMAIL',
        'NAME',
        'PHONE_NUMBER',
        'LOCATION',
        'ROLE',
        'EULA',
        'VERIFIED',
      ],
    });
    if (!user) {
      throw new NotFoundException({
        statusCode: 201,
        message: 'This email is not registered!',
        INVALID_USER: true,
      });
    }

    if (!user.VERIFIED) {
      throw new UnauthorizedException({
        statusCode: 202,
        message:
          'Thank you for applying for an account. Your account is currently pending approval by the site administrator.',
      });
    }

    let passwordMatch;
    try {
      passwordMatch = await bcrypt.compare(PASSWORD, user.PASSWORD);
    } catch (error) {
      console.error('Error comparing passwords:', error);
      throw new UnauthorizedException({
        statusCode: 201,
        message: 'You have entered an incorrect password!',
        INVALID_PASSWORD: true,
      });
    }

    if (!passwordMatch) {
      throw new UnauthorizedException({
        statusCode: 201,
        message: 'You have entered an incorrect password!',
        INVALID_PASSWORD: true,
      });
    }

    if (!user.EULA) {
      throw new BadRequestException({
        statusCode: 201,
        message: 'Please Accept the T&C',
      });
    }
    const payload = {
      EMAIL: user.EMAIL,
      NAME: user.NAME,
      PHONE_NUMBER: user.PHONE_NUMBER,
      LOCATION: user.LOCATION,
      ROLE: user.ROLE,
    };

    const accessToken = this.jwtService.sign(payload);

    const { PASSWORD: _, ...userWithoutPassword } = user;

    return {
      statusCode: 200,
      message: 'You have logged in successfully',
      accessToken,
      userInfo: userWithoutPassword,
    };
  }

  async terms(emailDto: EditUserDto) {
    const { EMAIL } = emailDto;

    const user = await this.usersRepository.findOne({
      where: { EMAIL: EMAIL.toUpperCase(), FLAG: 'ACTIVE' },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.EULA = true;

    await this.usersRepository.save(user);

    return {
      statusCode: 200,
      message: 'T&C accepted successfully',
    };
  }
  async approveUser(approveUserDto: ApproveUserDto) {
    const { EMAIL, ROLE } = approveUserDto;
    const email = EMAIL.toUpperCase();

    const user = await this.usersRepository.findOne({
      where: { EMAIL: email, FLAG: 'ACTIVE' },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.VERIFIED = true;
    user.ROLE = ROLE || user.ROLE;

    await this.usersRepository.save(user);

    return {
      statusCode: 200,
      message: 'User updated successfully',
    };
  }

  async editUser(editUserDto: EditUserDto) {
    const { EMAIL, NAME, PHONE_NUMBER, LOCATION, ROLE } = editUserDto;
    const email = EMAIL.toUpperCase();

    const user = await this.usersRepository.findOne({
      where: { EMAIL: email, FLAG: 'ACTIVE' },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.NAME = NAME || user.NAME;
    user.PHONE_NUMBER = PHONE_NUMBER || user.PHONE_NUMBER;
    user.LOCATION = LOCATION || user.LOCATION;
    user.ROLE = ROLE || user.ROLE;

    await this.usersRepository.save(user);

    return {
      statusCode: 200,
      message: 'User updated successfully',
    };
  }

  async getAllUsers(allUsersDto: AllUsersDto) {
    const {
      page = 1,
      limit = 10,
      SORT_VALUE = 'CREATED_AT',
      SORT_BY = 'DESC',
      filter,
    } = allUsersDto;

    const skip = (page - 1) * limit;

    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    if (filter) {
      queryBuilder.where('user.NAME LIKE :filter OR user.EMAIL LIKE :filter', {
        filter: `%${filter}%`,
      });
    }

    queryBuilder.orderBy(
      `user.${SORT_VALUE}`,
      SORT_BY.toUpperCase() as 'ASC' | 'DESC',
    );

    queryBuilder.skip(skip).take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    return {
      statusCode: 200,
      message: 'Users retrieved successfully',
      data: {
        users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { EMAIL, PASSWORD, NEW_PASSWORD } = resetPasswordDto;
    const email = EMAIL.toUpperCase();

    const user = await this.usersRepository.findOne({
      where: { EMAIL: email, FLAG: 'ACTIVE' },
      select: ['PASSWORD', 'EMAIL', 'ID', 'VERIFIED'],
    });

    if (!user) {
      throw new NotFoundException('Email not found');
    }

    if (!user.VERIFIED) {
      throw new UnauthorizedException('Email not verified');
    }
    const passwordMatch = await bcrypt.compare(PASSWORD, user.PASSWORD);
    if (!passwordMatch) {
      throw new UnauthorizedException('Your old password is not matching');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, salt);

    user.PASSWORD = hashedPassword;

    await this.usersRepository.update(user.ID, user);

    return {
      statusCode: 201,
      message: 'Password updated successfully',
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { EMAIL } = forgotPasswordDto;
    const email = EMAIL.toUpperCase();

    const user = await this.usersRepository.findOne({
      where: { EMAIL: email, FLAG: 'ACTIVE' },
    });

    if (!user) {
      throw new NotFoundException('Email not found');
    }

    const payload = {
      EMAIL: email,
      NAME: user.NAME,
      REASON: 'FORGOT PASSWORD',
    };

    const token = this.jwtService.sign(payload, { expiresIn: '2h' });
    const url = `${this.configService.get(
      'DOMAIN',
    )}/forgot-password?email=${email}&token=${token}`;
    console.log('url', url);
    // email service needs to intigrate, it will send a link to reset password to user's email

    return {
      statusCode: 200,
      message: 'An mail sent to your email to reset password',
    };
  }

  async deleteUser(deleteUserDto: DeleteUserDto) {
    const { EMAIL } = deleteUserDto;
    const email = EMAIL.toUpperCase();

    const user = await this.usersRepository.findOne({
      where: { EMAIL: email, FLAG: 'ACTIVE' },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.FLAG = 'INACTIVE';
    await this.usersRepository.save(user);

    return {
      statusCode: 200,
      message: 'User deleted successfully',
    };
  }

  async refreshToken(user: any) {
    if (user.iat) delete user.iat;
    if (user.exp) delete user.exp;

    const accessToken = this.jwtService.sign(user);

    return { accessToken };
  }
}
