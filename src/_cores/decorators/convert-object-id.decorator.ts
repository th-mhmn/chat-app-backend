import { Transform } from 'class-transformer';

export const ConvertObjectId = () => Transform(({ obj }) => obj._id.toString());
