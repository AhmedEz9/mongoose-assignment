// File Location: src/models/species.ts

import { Schema, model, Document, Types } from 'mongoose';
import validator from 'validator';

// Define the interface for a Species document
export interface ISpecies extends Document {
  species_name: string;
  image: string;
  category: Types.ObjectId;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}

// Define the schema for the Species model
const speciesSchema = new Schema<ISpecies>({
  species_name: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: function (v: string) {
        return validator.isURL(v);
      },
      message: (props: any) => `${props.value} is not a valid URL!`,
    },
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
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
          return (
            value.length === 2 &&
            value[0] >= -180 &&
            value[0] <= 180 && // Longitude range
            value[1] >= -90 &&
            value[1] <= 90 // Latitude range
          );
        },
        message:
          'Coordinates must be an array of two numbers: [longitude, latitude] within valid ranges.',
      },
    },
  },
});

// Create a 2dsphere index on the location field for geospatial queries
speciesSchema.index({ location: '2dsphere' });

// Create and export the Species model using the schema
export const Species = model<ISpecies>('Species', speciesSchema);
