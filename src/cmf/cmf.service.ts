import { Injectable } from '@nestjs/common';
import { CreateCmfDto } from './dto/create-cmf.dto';
import { UpdateCmfDto } from './dto/update-cmf.dto';
import axios from 'axios';
import xml2js from 'xml2js';

@Injectable()
export class CmfService {
  create(createCmfDto: CreateCmfDto) {
    return 'This action adds a new cmf';
  }

  async findAll() {
    const { data } = await axios.get('');
    xml2js.parseString(data, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error('Error parsing SOAP response:', err);
      } else {
        // Convert to JSON
        const jsonResponse = JSON.stringify(result);
        console.log(jsonResponse);
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} cmf`;
  }

  update(id: number, updateCmfDto: UpdateCmfDto) {
    return `This action updates a #${id} cmf`;
  }

  remove(id: number) {
    return `This action removes a #${id} cmf`;
  }
}
