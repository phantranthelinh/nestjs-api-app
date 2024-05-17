import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InsertNoteDTO, UpdateNoteDTO } from './dto';

@Injectable()
export class NoteService {
  constructor(private prismaService: PrismaService) {}
  async insertNote(userId: number, insertNoteDTO: InsertNoteDTO) {
    try {
      const note = await this.prismaService.note.create({
        data: {
          ...insertNoteDTO,
          userId: userId,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
  async getNoteById(noteId: number) {
    return await this.prismaService.note.findFirst({
      where: {
        id: noteId,
      },
    });
  }
  getNotes() {
    return this.prismaService.note.findMany({});
  }
  updateNoteById(id: number, updateNoteDTO: UpdateNoteDTO) {
    return this.prismaService.note.findFirst({
      where: {
        id: id,
      },
    });
  }
  async deleteById(noteId: number) {
    const note = await this.prismaService.note.findUnique({
      where: {
        id: noteId,
      },
    });

    if (!note) {
      throw new ForbiddenException('Cannot find note to delete');
    }
    return this.prismaService.note.delete({
      where: {
        id: noteId,
      },
    });
  }
}
