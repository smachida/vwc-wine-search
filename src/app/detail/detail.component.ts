import { Component, Input, ViewChild, OnInit } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';

@Component({
  selector: 'detail-dialog',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  @Input() wineData; // 親コンポーネントから取得
  @ViewChild("lgModal") modalRef: ModalDirective; // Modalダイアログへの参照

  // 現在表示中の写真の位置
  activeSlideIndex = 0;

  constructor() { }

  ngOnInit() {
  }

  openDialog() {
    this.activeSlideIndex = 0;
    this.modalRef.show();
  }
}
