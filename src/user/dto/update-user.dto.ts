import {
  IsDateString,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @MaxLength(128)
  @IsOptional()
  bio?: string;
  @MinLength(4)
  @MaxLength(32)
  @IsOptional()
  username?: string;
  @IsOptional()
  name?: string;
  @IsOptional()
  @IsDateString()
  birthDate?: Date;
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;
}
