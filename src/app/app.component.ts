import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { WineService, WineData} from "./wine.service";
import { DetailComponent} from './detail/detail.component';
import { ViewContainerRef, ViewChild } from '@angular/core';
import { HostListener} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  wineObj;
  selectedData;
  bookmarks;
  isMobile = false;
  MOBILE_SCREEN_WIDTH = 768;
  isCollapsed = false;

  @ViewChild("detailDialog") detailComponent: DetailComponent;

  countries = [
    {code: "CC0001", name: "フランス", data: null},
    {code: "CC0002", name: "イタリア", data: null},
    {code: "CC0003", name: "スペイン", data: null},
    {code: "CC0004", name: "ポルトガル", data: null},
    {code: "CC0005", name: "ドイツ", data: null},
    {code: "CC0009", name: "アメリカ", data: null},
    {code: "CC0011", name: "チリ", data: null},
    {code: "CC0013", name: "オーストラリア", data: null},
    {code: "CC0017", name: "日本", data: null},
    {code: "BOOKMARK", name: "お気に入り", data: null},
  ];
  viewContainerRef; // Modal ダイアログ表示用

  public constructor(private wineService: WineService,
                     viewContainerRef: ViewContainerRef) {
    this.viewContainerRef =  viewContainerRef;
  }

  ngOnInit() {
    this.getWine();
    this.initBookmarks();
    this.onScreenResize();
  }

  getWine() {
    this.selectedData = null;
    for (let i = 0; i < this.countries.length; i++) {
      let countryCode = this.countries[i].code;
      if (countryCode == "BOOKMARK") {
        continue;
      }
      this.wineService.getWineData(countryCode).subscribe(
        result => this.setWine(result, i),
        error => alert("Connection erron " + error)
      );
    }
  }

  setWine(result: WineData, i: number) {
    if (result.error) {
      alert("Web API error " + result.data);
      return;
    }
    this.countries[i].data = result;
  }

  onCountryChange(index) {
    let country = this.countries[index];
    if (country.code === "BOOKMARK") {
      if (Object.keys(this.bookmarks).length == 0) {
        alert("ブックマークが登録されていません");
        return;
      }
      this.selectedData = Object.keys(this.bookmarks).map(key => this.bookmarks[key]);
    } else {
      this.selectedData = country.data.data;
    }
    setTimeout(scroll(0,0), 1);
  }

  initBookmarks() {
    let storeData = localStorage.getItem("bookmarks");
    if (storeData) {
      this.bookmarks = JSON.parse(storeData);
    } else {
      this.bookmarks = {};
    }
  }

  onBookmarkClick(wineId, index) {
    if (!this.isMarked(wineId)) {
      if (Object.keys(this.bookmarks).length == 10) {
        return alert("ブックマークは最大10件です");
      }
      this.bookmarks[wineId] = this.selectedData[index];
    } else {
      delete this.bookmarks[wineId];
    }
    localStorage.setItem("bookmarks", JSON.stringify(this.bookmarks));
  }

  isMarked(wineId) {
    console.log("isMarked(wineId=" + wineId + ")");
    return this.bookmarks[wineId];
  }

  onDetailClick(index) {
    this.wineObj = this.selectedData[index];
    this.detailComponent.openDialog();
  }

  @HostListener("window:resize")
  onScreenResize() {
    this.isMobile = (innerWidth < this.MOBILE_SCREEN_WIDTH);
  }
}

