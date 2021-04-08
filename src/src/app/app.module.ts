import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
// Service
import { BoardDataService } from './controller/board-data.service';
// Components
import { AppComponent } from './app.component';
import { ProjectBoardGameComponent } from './view/project-board-game/project-board-game.component';
import { ProjectBoardGameSquareComponent } from './view/project-board-game-square/project-board-game-square.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectBoardGameComponent,
    ProjectBoardGameSquareComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    BoardDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
