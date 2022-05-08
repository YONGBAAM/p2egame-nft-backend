import { PartialType } from '@nestjs/mapped-types';
import { CreateItemv2Dto } from './create-itemv2.dto';

export class UpdateItemv2Dto extends PartialType(CreateItemv2Dto) {}
