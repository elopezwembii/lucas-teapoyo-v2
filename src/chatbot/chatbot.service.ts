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
        console.log(error);
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

    if (
      normalizedText.includes('quiero un resúmen del presupuesto de este mes')
    ) {
      return await this.showSugerences(token, extraData);
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
    const { budget, fixedSpends, variableSpends } =
      await this.retrieveBudgetData(token, extraData);
    if (!budget && !variableSpends.length && !fixedSpends.length) {
      return `Aún no tienes gastos que pueda utilizar para analizarlos. ¡Añade gastos para darte sugerencias!`;
    }
    const insightsContext = `[Instruccion : Eres un bot llamado luca$, no te presentes, debes dar la informacion con mucha educacion y con humor utilizando emojis: ]`;
    const response = await this.openAiService.ask(
      `${insightsContext} Analiza los siguientes datos y brinda sugerencias financieras teniendo en cuenta su balance mensual. Presupuesto: ${JSON.stringify(budget)} Gastos variables:${JSON.stringify(variableSpends)} Gastos fijos: ${JSON.stringify(fixedSpends)}  `,
    );
    return response;
  }
  async retrieveBudgetData(
    token: string,
    extraData: { month: number; year: number; userId: number },
  ) {
    const headers = {
      Authorization: `Bearer ${token.split('Bearer ')[1].trim()}`,
    };
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    const { data: budget } = await axios.get(
      `${this.configService.get('MAIN_API_URL')}/presupuesto_por_mes?mes=${extraData.month}&anio=${extraData.year}&id_usuario=${extraData.userId}`,
      {
        headers,
        httpAgent: agent,
      },
    );
    const { data: variableSpends } = await axios.get(
      `${this.configService.get('MAIN_API_URL')}/gastos_variables`,
      {
        headers,
        httpAgent: agent,
      },
    );
    const { data: fixedSpends } = await axios.get(
      `${this.configService.get('MAIN_API_URL')}/gastos_fijos`,
      {
        headers,
        httpAgent: agent,
      },
    );
    return { fixedSpends, variableSpends, budget };
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
