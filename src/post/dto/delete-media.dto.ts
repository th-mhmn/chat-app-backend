import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class DeleteMediaDto {
  @IsString()
  @IsNotEmpty()
  public_id: string;
}

export class DeleteMultipleMediaDto {
  @IsNotEmpty()
  @IsArray()
  public_ids: string[];
}
