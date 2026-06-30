import api from './api'

interface NotificationPayload {
  title: string
  message: string
  type: 'announcement' | 'homework' | 'exam' | 'fee' | 'system'
  userId: string
  schoolId: string
  data?: Record<string, any>
}

class NotificationService {
  async sendNotification(payload: NotificationPayload) {
    try {
      await api.post(`/schools/${payload.schoolId}/notifications`, payload)
      console.log('Notification sent:', payload.title)
    } catch (error) {
      console.error('Failed to send notification:', error)
    }
  }

  async sendBulkNotifications(schoolId: string, userIds: string[], payload: Omit<NotificationPayload, 'userId' | 'schoolId'>) {
    try {
      await api.post(`/schools/${schoolId}/notifications/bulk`, {
        userIds,
        ...payload
      })
      console.log(`Bulk notification sent to ${userIds.length} users`)
    } catch (error) {
      console.error('Failed to send bulk notifications:', error)
    }
  }

  async sendAnnouncementNotification(schoolId: string, announcementId: string, title: string, message: string) {
    await this.sendBulkNotifications(schoolId, [], {
      title,
      message,
      type: 'announcement',
      data: { announcementId }
    })
  }

  async sendHomeworkNotification(schoolId: string, studentIds: string[], homeworkId: string, title: string) {
    await this.sendBulkNotifications(schoolId, studentIds, {
      title,
      message: `New homework: ${title}`,
      type: 'homework',
      data: { homeworkId }
    })
  }

  async sendExamNotification(schoolId: string, studentIds: string[], examId: string, title: string) {
    await this.sendBulkNotifications(schoolId, studentIds, {
      title,
      message: `Exam scheduled: ${title}`,
      type: 'exam',
      data: { examId }
    })
  }

  async sendFeeNotification(schoolId: string, parentIds: string[], studentName: string, amount: number) {
    await this.sendBulkNotifications(schoolId, parentIds, {
      title: 'Fee Payment Due',
      message: `Fee payment of ${amount} is due for ${studentName}`,
      type: 'fee'
    })
  }

  // Request permission for push notifications
  async requestPermission(): Promise<boolean> {
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission()
        return permission === 'granted'
      }
      return false
    } catch (error) {
      console.error('Failed to request notification permission:', error)
      return false
    }
  }

  // Show local notification
  showLocalNotification(title: string, options?: NotificationOptions) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, options)
    }
  }
}

export default new NotificationService()
