import { Schema, model, Document } from 'mongoose';

export interface ICategory extends Document {
  category_name: string;
}

const categorySchema = new Schema<ICategory>({
  category_name: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
  },
});

export const Category = model<ICategory>('Category', categorySchema);
