import { Expose } from 'class-transformer';

export class ResponsePostDto {
  @Expose()
  _id: string;
  @Expose()
  backgroundColor: string;
  @Expose()
  content: string;
  @Expose()
  mediaUrls: string[];
  @Expose()
  visibility: IVisibility;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
