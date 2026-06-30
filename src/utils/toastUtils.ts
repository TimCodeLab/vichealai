import {toastController} from '@ionic/vue';

export function useAppToast() {
  async function showError(message: string) {
    const toast = await toastController.create({
      message,
      duration: 4000,
      position: 'top',
      color: 'danger'
    });
    await toast.present();
  }

  async function showWarning(message: string) {
    const toast = await toastController.create({
      message,
      duration: 4000,
      position: 'top',
      color: 'warning'
    });
    await toast.present();
  }

  async function showSuccess(message: string) {
    const toast = await toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color: 'success'
    });
    await toast.present();
  }

  async function showInfo(message: string) {
    const toast = await toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color: 'primary'
    });
    await toast.present();
  }

  return {
    showError,
    showWarning,
    showSuccess,
    showInfo
  };
}
