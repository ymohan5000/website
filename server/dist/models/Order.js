import mongoose, { Schema } from 'mongoose';
const orderSchema = new Schema({
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
}, { timestamps: true });
export const Order = mongoose.model('Order', orderSchema);
