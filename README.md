# 概要

Wine Mates アプリケーション - Virtual Wine Cellar(VWC) ワイン検索アプリ:

このアプリケーションは、vwc-server-java (ワイン情報検索 API)のフロントエンドです。

# HowTo: Build & Run

~~~
# git clone https://github.com/smachida/vwc-wine-search.git
# cd vwc-wine-search
~~~

~~~
以下のファイルの内容を修正

src/app/wine.service.ts:
WEB_API_URL のホスト名及びポート番号を、あらかじめ起動した vwc-server-java のエンドポイントにあわせて
「localhost:28080」などに変更。

〜〜〜　省略　〜〜〜
@Injectable()
export class WineService {
  WEB_API_URL: string = "http://ec2-52-192-145-111.ap-northeast-1.compute.amazonaws.com:28080/api/v1/wine/wines";
  //DEFAULT_SIZE: string = "30";
  〜〜〜　省略　〜〜〜
   
~~~

~~~
# npm install
# ng build --prod
# docker build --tag=vwc-wine-search .
# docker run -d -p 80:80 --rm --name vwc-wine-search vwc-wine-search

http://localhost にアクセス
~~~

# 依存関係

~~~
前提条件:
nodejs
npm
AngularCLI
docker
~~~
