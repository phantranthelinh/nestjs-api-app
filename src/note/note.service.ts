import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InsertNoteDTO, UpdateNoteDTO } from './dto';

@Injectable()
export class NoteService {
  constructor(private prismaService: PrismaService) {}
  async insertNote(userId: number, insertNoteDTO: InsertNoteDTO) {
    const note = await this.prismaService.note.create({
      data: {
        ...insertNoteDTO,
        userId: userId,
      },
    });
  }
  getNoteById(id: number) {
    return this.prismaService.note.findFirst({
      where: {
        id: id,
      },
    });
  }
  getNotes(userId: number) {
    return this.prismaService.note.findMany({});
  }
  updateNoteById(id: number, updateNoteDTO: UpdateNoteDTO) {
    return this.prismaService.note.findFirst({
      where: {
        id: id,
      },
    });
  }
  deleteById(noteId: number) {
    return this.prismaService.note.delete({
      where: {
        id: noteId,
      },
    });
  }
}
