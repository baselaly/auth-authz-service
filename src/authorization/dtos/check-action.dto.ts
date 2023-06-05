import { IsNotEmpty, IsString } from 'class-validator';

export class CheckActionDto {
  @IsNotEmpty()
  @IsString()
  action: string;
}
