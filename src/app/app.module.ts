import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { WineService } from "./wine.service";
import { HttpClientJsonpModule, HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CarouselModule, CollapseModule, ModalModule} from 'ngx-bootstrap';
import { AppComponent } from './app.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  declarations: [
    AppComponent,
    DetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientJsonpModule,
    HttpClientModule,
    ModalModule.forRoot(),
    CarouselModule.forRoot(),
    CollapseModule.forRoot()
  ],
  providers: [WineService],
  bootstrap: [AppComponent]
})
export class AppModule { }
