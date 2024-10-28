import { Schema, model, Document, Types } from 'mongoose';

export interface IAnimal extends Document {
  animal_name: string;
  birthdate: Date;
  species: Types.ObjectId;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}

const animalSchema = new Schema<IAnimal>({
  animal_name: {
    type: String,
    required: true,
    minlength: 2,
  },
  birthdate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value: Date) {
        return value <= new Date();
      },
      message: 'Birthdate cannot be in the future.',
    },
  },
  species: {
    type: Schema.Types.ObjectId,
    ref: 'Species',
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function (value: number[]) {
          return value.length === 2;
        },
        message: 'Coordinates must be an array of two numbers.',
      },
    },
  },
});

animalSchema.index({ location: '2dsphere' });

export const Animal = model<IAnimal>('Animal', animalSchema);
