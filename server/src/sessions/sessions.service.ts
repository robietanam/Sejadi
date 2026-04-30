import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from './schemas/session.schema';

@Injectable()
export class SessionsService {
  constructor(@InjectModel(Session.name) private model: Model<Session>) {}

  async create(userId: string, data: Partial<Session>) {
    const s = new this.model({ user: userId, ...data });
    return s.save();
  }

  async findByUser(userId: string) {
    return this.model.find({ user: userId }).sort({ createdAt: -1 }).exec();
  }

  async findById(id: string) {
    const s = await this.model.findById(id).exec();
    if (!s) throw new NotFoundException('Session not found');
    return s;
  }

  async revoke(id: string) {
    // Use findByIdAndDelete to remove the session document
    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Session not found');
    return deleted;
  }

  async revokeByDevice(userId: string, deviceId: string) {
    const deleted = await this.model
      .findOneAndDelete({ user: userId, _id: deviceId })
      .exec();
    if (!deleted) throw new NotFoundException('Session not found for device');
    return deleted;
  }

  async revokeAll(userId: string) {
    const res = await this.model.deleteMany({ user: userId }).exec();
    return res;
  }

  async findByRefreshToken(token: string) {
    return this.model.findOne({ refreshToken: token }).exec();
  }
}
