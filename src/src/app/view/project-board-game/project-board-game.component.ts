import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BoardDataService } from 'src/app/controller/board-data.service';
import { DisplayItemLine, ConnectLineType, ConnectPointType } from 'src/app/model/display-item-line.model';
import { DisplayItemSquare } from 'src/app/model/display-item-square.model';
import { RecordService, elemPieceStatus } from 'src/app/controller/record.service';

@Component({
  selector: 'app-project-board-game',
  templateUrl: './project-board-game.component.html',
  styleUrls: ['./project-board-game.component.css']
})
export class ProjectBoardGameComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas1') canvas1: ElementRef;

  /** コンテキスト */
  private context: CanvasRenderingContext2D;

  /** キャンバスの幅 */
  public canvasWidth: number;
  /** キャンバスの高さ */
  public canvasHeight: number;
  /** マス情報 */
  public squares: Array<DisplayItemSquare> = new Array<DisplayItemSquare>();
  /** 表示するプロジェクトのID */
  // public projectId = 3;   // ピースの位置は record.serviceに移したため削除
  public pieces: elemPieceStatus[];

  /**
   * コンストラクタ
   * @param boardDataService 盤情報サービス
   */
  constructor(
    private boardDataService: BoardDataService,
    private recordservice: RecordService
  ) {
    this.pieces = this.recordservice.getLatestSquareIdList();
  }

  /**
   * 初期化処理
   */
  ngOnInit() {
    // サービスから取得したデータをモデルにセットする
    this.boardDataService.fetchData();
    // 読み込み待ち
    this.boardDataService.observable.subscribe(() => {
      // キャンバス情報を設定
      this.canvas1.nativeElement.width = this.boardDataService.getCanvasWidth();
      this.canvas1.nativeElement.height = this.boardDataService.getCanvasHeight();
      // マス情報を設定
      this.squares = this.boardDataService.getSquares();
      // 要素をつなぐ線を描画する
      this.drawConnectors();
    });
  }

  /**
   * 初期化後の処理
   */
  ngAfterViewInit() {
    // ２次元描画用のレンダリングコンテキストを取得
    this.context = (this.canvas1.nativeElement).getContext('2d');
  }

  /**
   * 要素と要素の間に線を引く
   */
  private drawConnectors() {
    if (this.context == null) {
      return;
    }

    // いったんキャンバスを初期化
    this.context.clearRect(0, 0, this.canvas1.nativeElement.width, this.canvas1.nativeElement.height);

    const lineData = this.boardDataService.getLines();
    lineData.forEach((line: DisplayItemLine) => {
      // 線情報を元に線を描く
      this.drawConnector(line);
    });
  }

  /**
   * 接続情報を元に線を引く
   */
  private drawConnector(line: DisplayItemLine) {
    if (this.context == null) {
      return;
    }

    // マスの要素情報を取得する
    const source = this.boardDataService.findSquare(line.sourceId);
    if (source == null) {
      return;
    }
    const target = this.boardDataService.findSquare(line.targetId);
    if (target == null) {
      return;
    }

    // 開始点を取得する
    const beginPoint = source.getConnectorPoint(line.sourcePointType);
    // 終了点を取得する
    const endPoint = target.getConnectorPoint(line.targetPointType);

    // 描画開始
    this.context.strokeStyle = 'Black';
    this.context.beginPath();
    // 始点へ移動
    this.context.moveTo(beginPoint.x, beginPoint.y);
    // 線の描画タイプによって、書き方を変更する
    switch (line.connectLineType) {
      // 直線描画
      case ConnectLineType.Direct:
        this.context.lineTo(endPoint.x, endPoint.y);
        break;
      // 曲線描画
      case ConnectLineType.Curve:
        // TODO: 接続場所等によって、作成する線を変更すること
        const offset = 20;
        // まずは上へ
        this.context.lineTo(beginPoint.x, endPoint.y - offset);
        this.context.moveTo(beginPoint.x, endPoint.y - offset);
        // 横へ
        this.context.lineTo(endPoint.x, endPoint.y - offset);
        this.context.moveTo(endPoint.x, endPoint.y - offset);
        // 下
        this.context.lineTo(endPoint.x, endPoint.y);
        break;
    }
    this.context.closePath();
    this.context.stroke();
  }

  // *ngForのTrack用処理関数
  public trackByItem(index: number, piece: elemPieceStatus): number {
    return piece.piece_id;
  }
}
