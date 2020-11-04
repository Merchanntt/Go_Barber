import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import AvatarUploadService from '@modules/users/services/AvatarUpdateService';

export default class AvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const newAvatar = container.resolve(AvatarUploadService);

    const users = await newAvatar.execute({
      user_id: request.user.id,
      avatarFileName: request.file.filename,
    });

    return response.json(classToClass(users));
  }
}
