import {Request} from 'express'
import { UserEntity } from '@app/user/domain/model/user.entity'

export interface ExpressRequest extends Request {
  user?: UserEntity
}
