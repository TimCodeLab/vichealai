import { useIonToast } from '@ionic/vue'

export function useAppToast() {
  const toast = useIonToast()

  async function showError(message: string) {
    await toast.present({
      message,
      duration: 4000,
      position: 'top',
      color: 'danger',
      icon: 'alert-circle'
    })
  }

  async function showWarning(message: string) {
    await toast.present({
      message,
      duration: 4000,
      position: 'top',
      color: 'warning',
      icon: 'warning'
    })
  }

  async function showSuccess(message: string) {
    await toast.present({
      message,
      duration: 2000,
      position: 'top',
      color: 'success',
      icon: 'checkmark-circle'
    })
  }

  async function showInfo(message: string) {
    await toast.present({
      message,
      duration: 3000,
      position: 'top',
      color: 'primary',
      icon: 'information-circle'
    })
  }

  return {
    showError,
    showWarning,
    showSuccess,
    showInfo
  }
}
