import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ApisService } from '../apis/apis.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly apisService: ApisService) {} // Inject the service

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    //console.log(request.headers);
    const authHeader = (request.headers['authorization'] || '') as string;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new Error('Auth header is missing');
    }
    const hashedToken = authHeader.substring(6,authHeader.length);
    // console.log(hashedToken);
    const decodedToken = Buffer.from(hashedToken, 'base64').toString('utf-8');
    // console.log(decodedToken);
    let username = '';
    let password = '';

    let usernameTaken = false;
    for (let i = 0; i < decodedToken.length; i++) {
      if (decodedToken[i] == ':') {
        usernameTaken = true;
        continue;
      }
      if (usernameTaken == false) username += decodedToken[i];
      if (usernameTaken == true) password += decodedToken[i];
    }
    console.log(username,password);
    return await this.apisService.validateUser(username, password);
  }
}
