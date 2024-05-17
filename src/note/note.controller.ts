import { NoteService } from './note.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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
    return this.noteService.insertNote(userId, body);
  }
  @Get(':id')
  getNote(@Param('id') noteId: number) {
    return this.noteService.getNoteById(noteId);
  }
  @Get('')
  getNotes() {
    return this.noteService.getNotes();
  }
  @Patch(':id')
  updateNoteById(
    @Param('id', ParseIntPipe) noteId: number, //*validate noteID is "number"
    @Body() updateNoteDTO: UpdateNoteDTO,
  ) {
    return this.noteService.updateNoteById(noteId, updateNoteDTO);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('')
  deleteNote(@Query('id', ParseIntPipe) noteId: number) {
    return this.noteService.deleteById(noteId);
  }
}
