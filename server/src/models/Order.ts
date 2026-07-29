import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  userId?: mongoose.Types.ObjectId;
  serviceSlug: string;
  serviceName: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  requirements: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  amount?: number;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    serviceSlug: { type: String, required: true },
    serviceName: { type: String, required: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientPhone: String,
    requirements: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    amount: Number,
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', orderSchema);
