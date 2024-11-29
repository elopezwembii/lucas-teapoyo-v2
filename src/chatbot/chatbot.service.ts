// chat.service.ts
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { format } from 'date-fns'; // Para formatear la fecha
import { OpenAIService } from './open-ai.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chatbot } from './entities/chatbot.entity';
import { CreateChatbotDto } from './dto/create-chatbot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/shared/entities/user.entity';
import { Repository } from 'typeorm';
import { Budget } from 'src/shared/entities/budget.entity';
import { BudgetsService } from '../budgets/budgets.service';
import { GetBudgetResponse } from './interfaces/get-budget-response.interface';
import { GetVariableSpendResponse } from './interfaces/get-variable-spends-response.interface';
import { spendCategory } from 'src/budgets/constants/spend-category.constants';
import { GetSavingsResponse } from './interfaces/get-savings-response.interface';
import { savingType } from './constants/saving-type.constants';
import { GetDebtResponse } from './interfaces/get-debt-response.interface';
import { finantialEntities } from './constants/finantial-entitites.constants';
const https = require('https');

@Injectable()
export class ChatbotService {
  constructor(
    private readonly openAiService: OpenAIService,
    private readonly configService: ConfigService,
    @InjectModel(Chatbot.name, 'general')
    private readonly chatBotModel: Model<Chatbot>,
    @InjectRepository(Budget)
    private repository: Repository<Budget>,
    private readonly budgetsService: BudgetsService,
  ) {}

  async test() {
    return await this.repository.find();
  }
  async ask(
    { question, userId, year, month }: CreateChatbotDto,
    token: string,
  ) {
    if (!question) throw new BadRequestException('El mensaje es requerido.');

    if (!token) throw new UnauthorizedException('El token es requerido.');

    try {
      await this.chatBotModel.create({
        userId: userId,
        message: question,
        isChatGpt: false,
      });
      const response = await this.handleUserQuery(
        this.removeSpecialCharacters(question),
        token,
        {
          month,
          userId,
          year,
        },
      );
      await this.chatBotModel.create({
        userId,
        message: response,
        isChatGpt: true,
      });
      return {
        response,
        fecha: await this.dateFormat(),
        author: 'bot',
      };
    } catch (error: any) {
      if (error && error.status && error.status === 429) {
        throw new BadRequestException('Límite excedido.');
      } else {
        throw new InternalServerErrorException(error.error);
      }
    }
  }

  private async handleUserQuery(
    userText: string,
    token: string,
    extraData: { month: number; year: number; userId: number },
  ) {
    const normalizedText = this.removeSpecialCharacters(userText);

    if (normalizedText.includes('presupuesto')) {
      try {
        console.log({
          include: normalizedText.includes('presupuesto'),
          normalizedText,
        });
        return await this.showSugerences(token, extraData);
      } catch (error) {
        console.log({ error });
      }
    }
    if (await this.isGreeting(normalizedText)) {
      return await this.openAiService.ask(
        '[ Instruccion : Eres un bot llamado luca$ experto en finanzas, debes saludar con mucha educacion y con humor utilizando emojis, debes omitir responder la instruccion ]',
      );
    }

    if (await this.isThankYou(normalizedText)) {
      return await this.openAiService.ask(
        '[ Instruccion 1: Eres un bot llamado luca$ experto en finanzas, debes dar las gracias con mucha educacion y con humor utilizando emojis, no debes saludar, debes omitir responder la instruccion ]',
      );
    }

    if (await this.isQuestionEmpresaTeApoyo(normalizedText)) {
      return await this.openAiService.ask(
        'Cuando pregunte por te apoyo, debes indicar que es una plataforma para las finanzas personales que permite ingresar los ingresos, gastos, deudas, ahorros, tener análisis financiero, además indica que Mauricio y Karina son los creadores de la plataforma.',
      );
    }

    if (await this.isQuestionFinanceRelated(normalizedText)) {
      return await this.openAiService.ask(
        '[Instruccion : Eres un bot llamado luca$, no te presentes, debes dar la información con mucha educación y con humor utilizando emojis: ]' +
          normalizedText,
      );
    }

    return 'Lo siento, solo respondo preguntas relacionadas con finanzas.';
  }

  private async isGreeting(text: string) {
    const greetingCheckContext =
      'Determina si la siguiente oracion es un saludo:';
    const response = await this.openAiService.ask(
      greetingCheckContext + ' ' + text,
    );
    return response.toLowerCase().includes('sí');
  }

  private async showSugerences(
    token: string,
    extraData: { month: number; year: number; userId: number },
  ) {
    console.log('buscando...');
    try {
      const { budget, fixSpends, variableSpends, debt, savings } =
        await this.retrieveBudgetData(token, extraData);
      if (!budget && !variableSpends.length && !fixSpends.length) {
        return `Aún no tienes gastos que pueda utilizar para analizarlos. ¡Añade gastos para darte sugerencias!`;
      }
      const insightsContext = `[Instruccion : Eres un bot llamado luca$, no te presentes, debes dar la informacion con mucha educacion y con humor utilizando emojis: ]`;
      const response = await this.openAiService.ask(
        `${insightsContext} Analiza los siguientes datos y brinda sugerencias financieras teniendo en cuenta su balance mensual. Añade porcentajes, resúmenes y datos útiles acerca de toda la información aportada  
      
      Ingresos totales: $${budget.incoming} 
      Datos de Gastos totales por categoría: ${budget.items.map((item) => `${item.category}:${item.amount}`).join(',')} 
    
     Datos de Gastos variables: ${variableSpends.map((spend) => `${spend.category}:${spend.amount}`).join(',')},
      
      Datos decGastos fijos: ${fixSpends.map((spend) => `${spend.category}:${spend.amount}`).join(',')}
      
      Datos de Ahorros: ${savings.map((saving) => `Deseo: ${saving.goalDescription} Ahorro proyectado:$${saving.goalAmount} Total Ahorrado: $${saving.raised} Fecha límite ${saving.dateLimit} Tipo de ahorro: ${saving.savingType}`).join(',')}

      Datos de Deudas: ${debt.map((debt) => `Deuda: ${debt.description} Deuda tomada: ${debt.pendingDebt} Total cubierto: ${debt.paidAmount} Cuotas totales:${debt.totalFees} Cuotas cubiertas: ${debt.feesPaids}  Entidad financiera: ${debt.finantialEntity} Valor de cuota:$${debt.fee} Costo real de la deuda: ${debt.totalCost}`).join(',')}
       

      Si alguna información es erronea nula o ingresa con algún error, simplemente ignorala.


       
       `,
      );
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async retrieveBudgetData(
    token: string,
    extraData: { month: number; year: number; userId: number },
  ) {
    try {
      const headers = {
        Authorization: `Bearer ${token.split('Bearer ')[1].trim()}`,
      };

      // Obtén la URL base desde la configuración
      const apiUrl = this.configService.get('MAIN_API_URL');

      // Verifica si estamos en localhost
      const isLocalhost =
        apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1');

      // Si estamos en localhost, aseguramos que el protocolo sea 'http'
      const protocol = isLocalhost ? 'http' : 'https';

      // Configuración del agente para HTTP/HTTPS
      const agent = new https.Agent({
        rejectUnauthorized: false, // Esto es solo necesario si no tienes un certificado válido
      });

      // Construcción de la URL, ajustando el protocolo si es necesario
      const budgetUrl = `${protocol}://${apiUrl}/presupuesto_por_mes?mes=${extraData.month}&anio=${extraData.year}&id_usuario=${extraData.userId}`;
      const variableSpendsUrl = `${protocol}://${apiUrl}/gastos_variables`;
      const fixSpendsUrl = `${protocol}://${apiUrl}/gastos_fijos`;
      const savingsUrl = `${protocol}://${apiUrl}/obtener_ahorro`;
      const debtUrl = `${protocol}://${apiUrl}/obtener_deuda`;
      console.log({ variableSpendsUrl, fixSpendsUrl, savingsUrl });
      // Realizar las solicitudes usando Axios
      const { data: budget } = await axios.get<GetBudgetResponse>(budgetUrl, {
        headers,
        httpAgent: agent,
      });
      const { data: variableSpends } = await axios.get<
        GetVariableSpendResponse[]
      >(variableSpendsUrl, { headers, httpAgent: agent });
      const { data: fixSpends } = await axios.get<GetVariableSpendResponse[]>(
        fixSpendsUrl,
        { headers, httpAgent: agent },
      );
      const { data: savings } = await axios.get<GetSavingsResponse[]>(
        savingsUrl,
        { headers, httpAgent: agent },
      );
      const { data: debt } = await axios.get<GetDebtResponse[]>(debtUrl, {
        headers,
        httpAgent: agent,
      });

      // Procesar los datos obtenidos
      return {
        budget: {
          incoming: budget.ingreso,
          items: budget.presupuesto
            .find(
              (budget) =>
                budget.anio === extraData.year &&
                budget.mes === extraData.month,
            )
            .get_items.map((item) => ({
              category: spendCategory[item.tipo_gasto].description,
              amount: item.monto,
            })),
        },
        debt: debt.map(
          ({
            desc,
            costo_total,
            deuda_pendiente,
            cuotas_pagadas,
            cuotas_totales,
            id_banco,
            pago_mensual,
            dia_pago,
          }) => ({
            description: desc,
            feesPaids: cuotas_pagadas,
            totalFees: cuotas_totales,
            fee: pago_mensual,
            paidDay: dia_pago,
            totalCost: costo_total,
            pendingDebt: deuda_pendiente,
            paidAmount:
              cuotas_totales * pago_mensual - cuotas_pagadas * pago_mensual,
            finantialEntity: finantialEntities[id_banco].description,
          }),
        ),
        savings: savings.map(
          ({ desc, recaudado, meta, fecha_limite, tipo_ahorro }) => ({
            goalDescription: desc,
            goalAmount: meta,
            raised: recaudado,
            dateLimit: fecha_limite,
            savingType: savingType[tipo_ahorro].descripcion,
          }),
        ),
        fixSpends: fixSpends.map(
          ({ desc, get_sub_tipo, monto, dia, mes, anio }) => ({
            desc,
            category: get_sub_tipo.nombre,
            amount: monto,
            day: dia,
            month: mes,
            year: anio,
          }),
        ),
        variableSpends: variableSpends.map(
          ({ desc, get_sub_tipo, monto, dia, mes, anio }) => ({
            desc,
            category: get_sub_tipo.nombre,
            amount: monto,
            day: dia,
            month: mes,
            year: anio,
          }),
        ),
      };
    } catch (error) {
      console.log(error);
      return null; // Puedes manejar el error de otra manera si es necesario
    }
  }

  private async isThankYou(text: string) {
    const thankYouCheckContext =
      'Determina si la siguiente oracion es un agradecimiento:';
    const response = await this.openAiService.ask(
      thankYouCheckContext + ' ' + text,
    );
    return response.toLowerCase().includes('sí');
  }

  private async isQuestionFinanceRelated(text: string) {
    const financeCheckContext =
      'Determina si la siguiente oracion esta relacionada con finanzas:';
    const response = await this.openAiService.ask(
      financeCheckContext + ' ' + text,
    );
    return response.toLowerCase().includes('sí');
  }
  private async isQuestionFinancePersonalRelated(text: string) {
    const financeCheckContext =
      'Determina si la siguiente oracion esta relacionada con finanzas y si está preguntando por los datos personales del usuario:';
    const response = await this.openAiService.ask(
      financeCheckContext + ' ' + text,
    );
    return response.toLowerCase().includes('sí');
  }

  private async isQuestionEmpresaTeApoyo(text: string) {
    text = text.toLowerCase();
    const queries = [
      'te apoyo',
      'qué es te apoyo',
      'explícame qué es te apoyo',
      'información sobre te apoyo',
      'acerca de te apoyo',
    ];
    return queries.some((query) => text.includes(query));
  }

  private async dateFormat() {
    return format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX");
  }

  private removeSpecialCharacters(str: string) {
    const regex = /[^a-zA-Z0-9 ]/g;
    return str.replace(regex, '');
  }
}
