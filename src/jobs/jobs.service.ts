import { Injectable } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';

@Injectable()
export class JobsService {
  private sendNotification(clientId: number, message: string) {
    console.log(`Notificación enviada a ${clientId}: ${message}`);
  }

  @Cron('0 0 1 * *') 
  handleStartOfMonth() {
    const message = '¡Inicio de mes! Revisa tu presupuesto.';
    const clientId = 1; 
    this.sendNotification(clientId, message);
  }

  @Cron('0 0 15 * *') 
  handleMidMonth() {
    const message =
      '¡Mitad de mes! Es un buen momento para revisar tu presupuesto.';
    const clientId = 1; 
    this.sendNotification(clientId, message);
  }

  @Cron('0 0 28-31 * *') 
  handleEndOfMonth() {
    const message =
      '¡Fin de mes! Asegúrate de que tu presupuesto esté actualizado.';
    const clientId = 1; 
    this.sendNotification(clientId, message);
  }

  @Interval(172800000) 
  handleEvery48Hours() {
    const message = '¿Cómo va tu presupuesto? ¡No olvides revisarlo!';
    const clientId = 1;
    this.sendNotification(clientId, message);
  }
}
