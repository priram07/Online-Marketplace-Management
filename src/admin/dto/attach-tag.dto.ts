import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class AttachTagDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.toLowerCase().trim())
  name: string; // creates the tag if it doesn't exist yet
}
