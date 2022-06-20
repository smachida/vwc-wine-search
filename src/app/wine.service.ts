import {Injectable} from "@angular/core";
import {HttpParams, JsonpClientBackend, HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";

export interface WineData {
  error: string;
  data: string;
}

@Injectable()
export class WineService {
  //WEB_API_URL: string = 'http://ec2-13-230-78-106.ap-northeast-1.compute.amazonaws.com:8080/api/v1/wine/wines';
  //WEB_API_URL: string = "http://localhost:8080/api/v1/wine/wines";
  WEB_API_URL: string = "http://172.16.131.16:8080/api/v1/wine/wines";

  // DEFAULT_SIZE: string = "30";

  constructor(private http: HttpClient) {

  }

  getWineData(countryCode: string): Observable<WineData> {
    let config = this.setParam(countryCode);
    return this.reqData(config);
  }

  setParam(countryCode: string) : HttpParams {
    // Url params
    return (new HttpParams())
      .set("countryCode", countryCode)
      //.set("count", this.DEFAULT_SIZE)
  }

  reqData(config): Observable<WineData> {
    let url = this.WEB_API_URL + "?" + config.toString();

    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
      })
    };

    return this.http.get(url, httpOptions)
      .map(res => {
          let wineData;
          let dataObj = res['results'];
          wineData = {
            error: null,
            data: dataObj
          };

          console.dir(wineData);
          return wineData;
        }
      );
  }
}
