import { PartialType } from '@nestjs/mapped-types';
import { CreateUserv2Dto } from './create-userv2.dto';

export class UpdateUserv2Dto extends PartialType(CreateUserv2Dto) {}
