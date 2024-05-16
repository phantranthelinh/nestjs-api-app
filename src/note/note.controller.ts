import { NoteService } from './note.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '../auth/decorator';
import { MyJwtGuard } from '../auth/guard';
import { InsertNoteDTO, UpdateNoteDTO } from './dto';

@UseGuards(MyJwtGuard)
@Controller('notes')
export class NoteController {
  constructor(private noteService: NoteService) {}
  @Post('/')
  insertNote(@User('id') userId: number, @Body() body: InsertNoteDTO) {
    console.log('insertNote', userId);
    return this.noteService.insertNote(userId, body);
  }
  @Get(':id')
  getNote(@Param('id') noteId: number) {
    return this.noteService.getNoteById(noteId);
  }
  @Get('/notes')
  getNotes(@User('id') userId: number) {
    return this.noteService.getNotes(userId);
  }
  @Patch(':id')
  updateNoteById(
    @Param('id', ParseIntPipe) noteId: number, //*validate noteID is "number"
    @Body() updateNoteDTO: UpdateNoteDTO,
  ) {
    return this.noteService.updateNoteById(noteId, updateNoteDTO);
  }
  @Delete(':id')
  deleteNote(@Param('id', ParseIntPipe) noteId: number) {
    return this.noteService.deleteById(noteId);
  }
}
