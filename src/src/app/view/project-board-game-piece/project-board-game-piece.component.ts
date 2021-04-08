import { Component, Input, OnInit } from '@angular/core';
import { BoardDataService } from 'src/app/controller/board-data.service';

@Component({
  selector: 'app-project-board-game-piece',
  templateUrl: './project-board-game-piece.component.html',
  styleUrls: ['./project-board-game-piece.component.css']
})
export class ProjectBoardGamePieceComponent implements OnInit {

  @Input() id: number

  /** 位置座標x */
  public x: string = '0px';
  /** 位置座標y */
  public y: string = '0px';

  /** 駒のマス内判定点までのオフセット（左上から） X方向 */
  private readonly c_offset_x: number = 50;
  /** 駒のマス内判定点までのオフセット（左上から） Y方向 */
  private readonly c_offset_y: number = 50;
  
  /**
   * コンストラクタ
   * @param boardDataService 盤情報サービス
   */
   constructor(
    private boardDataService: BoardDataService,
  ) {
    this.boardDataService.observable.subscribe(() => {
      this.OnInit()}
    );
  }

  ngOnInit() {
  }

  OnInit(): void {
    // IDからマス情報を取得する
    let square = this.boardDataService.findSquare(this.id);
    if (square == null) {
      square = this.boardDataService.findSquare(1)
    }
    
    if (square != null) {
      this.x = `${square.X}px`;
      this.y = `${square.Y}px`;
    }
  }

  /**
   * ドラッグ完了時のイベント
   * @param event 
   */
  onDragEnded(event: any) {
    // ドラッグしているアイテムの位置情報を取得する
    const { offsetLeft, offsetTop } = event.source.element.nativeElement;
    // 移動距離を取得する
    const { x, y } = event.distance;
    // 新しい座標を定義する
    const newX = offsetLeft + x;
    const newY = offsetTop + y;

    // マスにいるかどうか
    // ※マスの中にいるかどうかの判定時、駒の左上座標を用いるとユーザーの操作感と不一致が生じる。
	// (駒の左上がマス内に入っていないと、	「マス内に入っていない」と判定されてしまう)
    //   このため、マスの中にいるかどうかの判定に用いる点は、左上座標からオフセット分画像の内側に入った位置を用いる
    const square = this.boardDataService.findSquareByPosition(newX + this.c_offset_x, newY + this.c_offset_y);

    if (square != null) {
      // 現在の状態から移動できるマスかどうか
      if (this.boardDataService.isMovable(this.id, square.Id)) {
        // 移動する
        this.x = `${square.X}px`;
        this.y = `${square.Y}px`;
        // id更新
        this.id = square.Id;
      }
    }

    // ドラッグの状態は元に戻す
    // （位置情報をそのまま変更しているので、ドラッグ情報を削除しておかないと、その分移動されてしまう）
    event.source._dragRef.reset();
  }
}
