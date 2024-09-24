import { auth, currentUser } from '@clerk/nextjs'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

import prisma from '@/lib/db'

type Props = {
  entityId: string
  entityType: ENTITY_TYPE
  entityTitle: string
  action: ACTION
}

export const createAuditLog = async (props: Props) => {
  try {
    const { orgId } = auth()
    const user = await currentUser()

    if (!user || !orgId) {
      throw new Error('User not found')
    }

    const { action, entityId, entityTitle, entityType } = props

    let userName = user.username;
    if (!userName) {
      if (user.firstName && user.lastName) {
        userName = user.firstName + ' ' + user.lastName;
      } else if (user.firstName) {
        userName = user.firstName;
      } else if (user.lastName) {
        userName = user.lastName;
      } else {
        userName = user.id;
      }
    }

    await prisma.auditLog.create({
      data: {
        orgId,
        entityId,
        entityType,
        entityTitle,
        action,
        userId: user.id,
        userImage: user.imageUrl,
        userName,
      },
    })
  } catch (error) {
    console.log('[AUDIT_LOG_ERROR]:', error)
  }
}
