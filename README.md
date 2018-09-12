# 概要

Wine Mates アプリケーション - Virtual Wine Cellar(VWC) サービス:

# HowTo: Build & Run

~~~
# git clone https://github.com/smachida/vwc-server-java.git
# cd vwc-server-java
~~~

~~~
以下の２つのファイルの内容を修正

pom.xml:
<imageName></imageName> の値を「smachida/${project.artifactId}」から「vwc-server」などに変更

〜〜〜　省略　〜〜〜
<build>
  <finalName>${project.artifactId}</finalName>
  <plugins>
    <plugin>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-maven-plugin</artifactId>
    </plugin>
    <plugin>
      <groupId>com.spotify</groupId>
        <artifactId>docker-maven-plugin</artifactId>
        <version>1.1.1</version>
        <configuration>
          <imageName>smachida/${project.artifactId}</imageName>               
          <dockerDirectory>${docker.baseDir}</dockerDirectory>
         〜〜〜　中略　〜〜〜
</build>

docker-compose.yml:
vwc-server の「image」の値を上記設定にあわせて「smachida/vwc-server」から「vwc-server」などに変更。また、必要に応じて外部に公開するエンドポイントのポート番号も変更（デフォルトでは 80 -> 8080 へのポートフォワーディング)。

〜〜〜　省略　〜〜〜
  vwc-server:
    image: smachida/vwc-server
    depends_on:
      - vwc-mysql
    ports:
      - 80:8080
    environment:
      - DATABASE_HOST=vwc-mysql
      - DATABASE_USER=vwcuser
      - DATABASE_PASSWORD=vwcpassword
      - DATABASE_NAME=vwcserverdb
      - DATABASE_PORT=3306
  〜〜〜　省略　〜〜〜
  
~~~

~~~
# ./mvnw clean package -DskipTests=true docker:build
# docker-compose up -d
~~~

# 依存関係

~~~
前提条件:
Java
docker
docker-compose
MySQL(IDEなどでの開発時。dockerでの実行時には公式イメージを利用)
~~~

~~~
このプロジェクトでは lombok を利用しています。
https://projectlombok.org/

プロジェクトを STSやEclipse などで読み込むと、そのままではIDE上でエラーが発生しているように表示されます。
以下のサイトから「lombok.jar」をダウンロードして、lombokをIDEにインストールしてください。

https://projectlombok.org/download

// インストーラの起動
java -jar lombok.jar
~~~

# [API 0.0.5]
## ワイン情報検索 API

~~~
・ベースURL
  http://<hostname>:<port>/api/v1/wine
~~~

~~~
・ワイン
  ・一覧取得: GET /wines
  ・IDによる検索: GET /wines/{wineId}
・ワインメーカー
  ・一覧取得: GET /makers
・色
  ・一覧取得: GET /colors
・格付け
  ・一覧取得: GET /ratings
・国
  ・一覧取得: GET /countries
・地域
  ・一覧取得: GET /regions
・ブドウ品種
  ・一覧取得: GET /varieties
・風味
  ・一覧取得: GET /tastes
~~~

### 検索例
~~~
・ワイン情報の取得
 Request:
 http://<hostname>:<port>/api/v1/wine/wines/JPYN00001
 
 Response:
 {
  "wineId": "JPYN00001",
  "name": "イケダワイナリー・セレクト",
  "description": "最近の流れである、個性豊かな甲州のスタイル。醸造家のこだわり、職人性を感じるこの甲州は、樽の効いたロワールのシュナン・ブランのような香りと味わい。果実味と直結したゆるやかな甘味と上品でまったりとした余韻をもつ、まさに日本のソムリエが待っていた国産の辛口といえる。",
  "wineColor": {
    "colorId": "C0002",
    "name": "白",
    "description": "果皮や種子を先に取り除き、果汁だけを発酵させて造られるワイン。黄緑色や薄いピンク色の果皮を持つ白ブドウを原料とすることが多いが、黒ブドウから造られるものもある。"
  },
  "wineMaker": {
    "wineMakerId": "JPYN0001",
    "name": "イケダワイナリー",
    "region": {
      "regionCode": "JP0001",
      "name": "山梨県"
    },
    "country": {
      "countryCode": "CC0017",
      "name": "日本",
      "regions": [
        {
          "regionCode": "JP0001",
          "name": "山梨県"
        },
        {
          "regionCode": "JP0002",
          "name": "北海道"
        },
        {
          "regionCode": "JP0003",
          "name": "長野県"
        },
        {
          "regionCode": "JP0004",
          "name": "山形県"
        }
      ]
    }
  },
  "wineTaste": {
    "tasteCode": "T0005",
    "description": "中口"
  },
  "rating": {
    "ratingCode": "R00000006",
    "description": "５つ星",
    "wineColor": {
      "colorId": "C0002",
      "name": "白",
      "description": "果皮や種子を先に取り除き、果汁だけを発酵させて造られるワイン。黄緑色や薄いピンク色の果皮を持つ白ブドウを原料とすることが多いが、黒ブドウから造られるものもある。"
    }
  },
  "grapeVariety": {
    "grapeVarietyCode": "W0007",
    "name": "甲州",
    "description": "日本を代表する品種。早飲みタイプが多い。香りや味わいが穏やかで個性に乏しいとされ、大半が甘口であったが、近年品質が向上し多彩な辛口ワインが生まれている。",
    "wineColor": {
      "colorId": "C0002",
      "name": "白",
      "description": "果皮や種子を先に取り除き、果汁だけを発酵させて造られるワイン。黄緑色や薄いピンク色の果皮を持つ白ブドウを原料とすることが多いが、黒ブドウから造られるものもある。"
    }
  },
  "grapeVarieties": [
    {
      "grapeVarietyCode": "W0007",
      "name": "甲州",
      "description": "日本を代表する品種。早飲みタイプが多い。香りや味わいが穏やかで個性に乏しいとされ、大半が甘口であったが、近年品質が向上し多彩な辛口ワインが生まれている。",
      "wineColor": {
        "colorId": "C0002",
        "name": "白",
        "description": "果皮や種子を先に取り除き、果汁だけを発酵させて造られるワイン。黄緑色や薄いピンク色の果皮を持つ白ブドウを原料とすることが多いが、黒ブドウから造られるものもある。"
      }
    }
  ],
  "imageUrl": "http://",
  "imageCaption": "イケダワイナリー・セレクト 2011",
  "year": 2011,
  "priceBottle": 2100,
  "priceHalfBottle": -1,
  "createdAt": "2018-09-11T14:04:19.000+0000",
  "updatedAt": "2018-09-11T14:04:19.000+0000"
}
~~~

~~~
ワインメーカー:

[
  {
    "wineMakerId": "USNP0001",
    "name": "オーパス・ワン・ワイナリー",
    "region": {
      "regionCode": "US0001",
      "name": "ナパ・ヴァレー"
    },
    "country": {
      "countryCode": "CC0009",
      "name": "アメリカ",
      "regions": [
        {
          "regionCode": "US0001",
          "name": "ナパ・ヴァレー"
        },
        {
          "regionCode": "US0002",
          "name": "サンタクララ"
        },
        {
          "regionCode": "US0003",
          "name": "ソノマ"
        },
        {
          "regionCode": "US0004",
          "name": "オレゴン"
        },
        {
          "regionCode": "US0005",
          "name": "ワシントン"
        },
        {
          "regionCode": "US0006",
          "name": "モントレー"
        },
        {
          "regionCode": "US0007",
          "name": "サンタ・バーバラ"
        },
        {
          "regionCode": "US0008",
          "name": "シエラ・フットヒルズ"
        },
        {
          "regionCode": "US0009",
          "name": "サウス・コースト"
        },
        {
          "regionCode": "US0010",
          "name": "ニューヨーク"
        }
      ]
    }
  },
  ・・・以下省略
]
~~~

~~~
色:

[
  {
    "colorId": "C0001",
    "name": "赤",
    "description": "果皮や種子を一緒に発行させ、果皮から色素を引き出したワイン。主に黒みがかった紫色の果皮を持つ黒ブドウから造られる。種子から引き出されたタンニンによる渋味をもつ。"
  },
  {
    "colorId": "C0002",
    "name": "白",
    "description": "果皮や種子を先に取り除き、果汁だけを発酵させて造られるワイン。黄緑色や薄いピンク色の果皮を持つ白ブドウを原料とすることが多いが、黒ブドウから造られるものもある。"
  },
  {
    "colorId": "C0003",
    "name": "ロゼ",
    "description": "果皮から引き出す色を醸造方法によって調整し、赤ワインと白ワインの中間のピンク色に仕立てられるワイン。黒ブドウが原料のものや黒ブドウと白ブドウを合わせるものがある。"
  },
  {
    "colorId": "C0004",
    "name": "スパークリング",
    "description": "醸造過程で二酸化炭素（炭酸ガス）を溶け込ませた、発泡性をもつワイン。フランスのシャンパーニュや、スペインのカヴァなどが有名。一般的に３気圧以上のものを指す。それ以下のものは弱発泡性ワインと区分される。"
  }
]
~~~

~~~
格付け:

[
  {
    "ratingCode": "R00000001",
    "description": "５つ星",
    "wineColor": {
      "colorId": "C0001",
      "name": "赤",
      "description": "果皮や種子を一緒に発行させ、果皮から色素を引き出したワイン。主に黒みがかった紫色の果皮を持つ黒ブドウから造られる。種子から引き出されたタンニンによる渋味をもつ。"
    }
  },
  {
    "ratingCode": "R00000002",
    "description": "４つ星",
    "wineColor": {
      "colorId": "C0001",
      "name": "赤",
      "description": "果皮や種子を一緒に発行させ、果皮から色素を引き出したワイン。主に黒みがかった紫色の果皮を持つ黒ブドウから造られる。種子から引き出されたタンニンによる渋味をもつ。"
    }
  },
  {
    "ratingCode": "R00000003",
    "description": "３つ星",
    "wineColor": {
      "colorId": "C0001",
      "name": "赤",
      "description": "果皮や種子を一緒に発行させ、果皮から色素を引き出したワイン。主に黒みがかった紫色の果皮を持つ黒ブドウから造られる。種子から引き出されたタンニンによる渋味をもつ。"
    }
  },
  {
    "ratingCode": "R00000004",
    "description": "２つ星",
    "wineColor": {
      "colorId": "C0001",
      "name": "赤",
      "description": "果皮や種子を一緒に発行させ、果皮から色素を引き出したワイン。主に黒みがかった紫色の果皮を持つ黒ブドウから造られる。種子から引き出されたタンニンによる渋味をもつ。"
    }
  },
  {
    "ratingCode": "R00000005",
    "description": "１つ星",
    "wineColor": {
      "colorId": "C0001",
      "name": "赤",
      "description": "果皮や種子を一緒に発行させ、果皮から色素を引き出したワイン。主に黒みがかった紫色の果皮を持つ黒ブドウから造られる。種子から引き出されたタンニンによる渋味をもつ。"
    }
  },
  ・・・以下省略
]
~~~

~~~
国:

[
  {
    "countryCode": "CC0001",
    "name": "フランス",
    "regions": [
      {
        "regionCode": "FR0001",
        "name": "ボルドー"
      },
      {
        "regionCode": "FR0002",
        "name": "ブルゴーニュ"
      },
      {
        "regionCode": "FR0003",
        "name": "シャンパーニュ"
      },
      {
        "regionCode": "FR0004",
        "name": "アルザス地方"
      },
      {
        "regionCode": "FR0005",
        "name": "ロワール"
      },
      {
        "regionCode": "FR0006",
        "name": "コート・デュ・ローヌ"
      },
      {
        "regionCode": "FR0007",
        "name": "ジュラ/サヴォワ"
      },
      {
        "regionCode": "FR0008",
        "name": "シュッド・ウエスト"
      },
      {
        "regionCode": "FR0009",
        "name": "ラングドック/ルーション"
      },
      {
        "regionCode": "FR0010",
        "name": "プロヴァンス/コルシカ島"
      }
    ]
  },
  {
    "countryCode": "CC0002",
    "name": "イタリア",
    "regions": [
      {
        "regionCode": "IT0001",
        "name": "ピエモンテ"
      },
      {
        "regionCode": "IT0002",
        "name": "ロンバルディア"
      },
      {
        "regionCode": "IT0003",
        "name": "ヴェネト"
      },
      {
        "regionCode": "IT0004",
        "name": "トスカーナ"
      },
      {
        "regionCode": "IT0005",
        "name": "カンパーニャ"
      }
    ]
  },
  {
    "countryCode": "CC0003",
    "name": "スペイン",
    "regions": [
      {
        "regionCode": "ES0001",
        "name": "リアス・バイシャス"
      },
      {
        "regionCode": "ES0002",
        "name": "ルエダ"
      },
      {
        "regionCode": "ES0003",
        "name": "リベラ・デル・ドゥエロ"
      },
      {
        "regionCode": "ES0004",
        "name": "リオハ"
      },
      {
        "regionCode": "ES0005",
        "name": "ヘレス"
      },
      {
        "regionCode": "ES0006",
        "name": "ラ・マンチャ"
      },
      {
        "regionCode": "ES0007",
        "name": "プリオラート"
      },
      {
        "regionCode": "ES0008",
        "name": "ペネデス"
      }
    ]
  },
  {
    "countryCode": "CC0004",
    "name": "ポルトガル",
    "regions": []
  },
  {
    "countryCode": "CC0005",
    "name": "ドイツ",
    "regions": [
      {
        "regionCode": "DE0001",
        "name": "モーゼル"
      },
      {
        "regionCode": "DE0002",
        "name": "ラインガウ"
      },
      {
        "regionCode": "DE0003",
        "name": "ラインヘッセン"
      },
      {
        "regionCode": "DE0004",
        "name": "フランケン"
      }
    ]
  },
  {
    "countryCode": "CC0006",
    "name": "ルーマニア",
    "regions": []
  },
  {
    "countryCode": "CC0007",
    "name": "ハンガリー",
    "regions": []
  },
  {
    "countryCode": "CC0008",
    "name": "ブルガリア",
    "regions": []
  },
  {
    "countryCode": "CC0009",
    "name": "アメリカ",
    "regions": [
      {
        "regionCode": "US0001",
        "name": "ナパ・ヴァレー"
      },
      {
        "regionCode": "US0002",
        "name": "サンタクララ"
      },
      {
        "regionCode": "US0003",
        "name": "ソノマ"
      },
      {
        "regionCode": "US0004",
        "name": "オレゴン"
      },
      {
        "regionCode": "US0005",
        "name": "ワシントン"
      },
      {
        "regionCode": "US0006",
        "name": "モントレー"
      },
      {
        "regionCode": "US0007",
        "name": "サンタ・バーバラ"
      },
      {
        "regionCode": "US0008",
        "name": "シエラ・フットヒルズ"
      },
      {
        "regionCode": "US0009",
        "name": "サウス・コースト"
      },
      {
        "regionCode": "US0010",
        "name": "ニューヨーク"
      }
    ]
  },
  {
    "countryCode": "CC0010",
    "name": "カナダ",
    "regions": []
  },
  {
    "countryCode": "CC0011",
    "name": "チリ",
    "regions": [
      {
        "regionCode": "CL0001",
        "name": "アコンガグア・ヴァレー"
      },
      {
        "regionCode": "CL0002",
        "name": "カサブランカ・ヴァレー"
      },
      {
        "regionCode": "CL0003",
        "name": "サン・アントニオ・ヴァレー"
      },
      {
        "regionCode": "CL0004",
        "name": "マイポ・ヴァレー"
      },
      {
        "regionCode": "CL0005",
        "name": "ラペル・ヴァレー"
      }
    ]
  },
  {
    "countryCode": "CC0012",
    "name": "アルゼンチン",
    "regions": [
      {
        "regionCode": "AL0001",
        "name": "サン・ファン州"
      },
      {
        "regionCode": "AL0002",
        "name": "メンドーサ州"
      },
      {
        "regionCode": "AL0003",
        "name": "サルタ州"
      },
      {
        "regionCode": "AL0004",
        "name": "ラ・リオハ州"
      },
      {
        "regionCode": "AL0005",
        "name": "リオ・ネグロ州"
      }
    ]
  },
  {
    "countryCode": "CC0013",
    "name": "オーストラリア",
    "regions": [
      {
        "regionCode": "AU0001",
        "name": "マーガレット・リヴァー"
      },
      {
        "regionCode": "AU0002",
        "name": "クレア・ヴァレー"
      },
      {
        "regionCode": "AU0003",
        "name": "マクラーレン・ヴェイル"
      },
      {
        "regionCode": "AU0004",
        "name": "バロッサ・ヴァレー"
      },
      {
        "regionCode": "AU0005",
        "name": "クナワラ"
      },
      {
        "regionCode": "AU0006",
        "name": "ヤラ・ヴァレー"
      },
      {
        "regionCode": "AU0007",
        "name": "タスマニア州"
      },
      {
        "regionCode": "AU0008",
        "name": "ハンター・ヴァレー"
      }
    ]
  },
  {
    "countryCode": "CC0014",
    "name": "ニュージーランド",
    "regions": [
      {
        "regionCode": "NZ0001",
        "name": "カンタベリー"
      },
      {
        "regionCode": "NZ0002",
        "name": "ワイカト"
      },
      {
        "regionCode": "NZ0003",
        "name": "ギズボーン"
      },
      {
        "regionCode": "NZ0004",
        "name": "ホークス・ベイ"
      },
      {
        "regionCode": "NZ0005",
        "name": "ウエリントン"
      },
      {
        "regionCode": "NZ0006",
        "name": "マールボロ"
      },
      {
        "regionCode": "NZ0007",
        "name": "セントラル・オタゴ"
      }
    ]
  },
  {
    "countryCode": "CC0015",
    "name": "南アフリカ共和国",
    "regions": [
      {
        "regionCode": "ZA0001",
        "name": "コンスタンシア"
      },
      {
        "regionCode": "ZA0002",
        "name": "パール"
      },
      {
        "regionCode": "ZA0003",
        "name": "ステレンボッシュ"
      },
      {
        "regionCode": "ZA0004",
        "name": "オリファンツ・リヴァー"
      },
      {
        "regionCode": "ZA0005",
        "name": "ブレーダ・リヴァー"
      },
      {
        "regionCode": "ZA0006",
        "name": "クライン・カルー"
      }
    ]
  },
  {
    "countryCode": "CC0016",
    "name": "中国",
    "regions": []
  },
  {
    "countryCode": "CC0017",
    "name": "日本",
    "regions": [
      {
        "regionCode": "JP0001",
        "name": "山梨県"
      },
      {
        "regionCode": "JP0002",
        "name": "北海道"
      },
      {
        "regionCode": "JP0003",
        "name": "長野県"
      },
      {
        "regionCode": "JP0004",
        "name": "山形県"
      }
    ]
  }
]
~~~

~~~
地域:

[
  {
    "regionCode": "AL0001",
    "name": "サン・ファン州"
  },
  {
    "regionCode": "AL0002",
    "name": "メンドーサ州"
  },
  {
    "regionCode": "AL0003",
    "name": "サルタ州"
  },
  {
    "regionCode": "AL0004",
    "name": "ラ・リオハ州"
  },
  {
    "regionCode": "AL0005",
    "name": "リオ・ネグロ州"
  },
  {
    "regionCode": "AU0001",
    "name": "マーガレット・リヴァー"
  },
  {
    "regionCode": "AU0002",
    "name": "クレア・ヴァレー"
  },
  {
    "regionCode": "AU0003",
    "name": "マクラーレン・ヴェイル"
  },
  {
    "regionCode": "AU0004",
    "name": "バロッサ・ヴァレー"
  },
  {
    "regionCode": "AU0005",
    "name": "クナワラ"
  },
  {
    "regionCode": "AU0006",
    "name": "ヤラ・ヴァレー"
  },
  {
    "regionCode": "AU0007",
    "name": "タスマニア州"
  },
  {
    "regionCode": "AU0008",
    "name": "ハンター・ヴァレー"
  },
  {
    "regionCode": "CL0001",
    "name": "アコンガグア・ヴァレー"
  },
  {
    "regionCode": "CL0002",
    "name": "カサブランカ・ヴァレー"
  },
  {
    "regionCode": "CL0003",
    "name": "サン・アントニオ・ヴァレー"
  },
  {
    "regionCode": "CL0004",
    "name": "マイポ・ヴァレー"
  },
  {
    "regionCode": "CL0005",
    "name": "ラペル・ヴァレー"
  },
  {
    "regionCode": "DE0001",
    "name": "モーゼル"
  },
  {
    "regionCode": "DE0002",
    "name": "ラインガウ"
  },
  {
    "regionCode": "DE0003",
    "name": "ラインヘッセン"
  },
  {
    "regionCode": "DE0004",
    "name": "フランケン"
  },
  {
    "regionCode": "ES0001",
    "name": "リアス・バイシャス"
  },
  {
    "regionCode": "ES0002",
    "name": "ルエダ"
  },
  {
    "regionCode": "ES0003",
    "name": "リベラ・デル・ドゥエロ"
  },
  {
    "regionCode": "ES0004",
    "name": "リオハ"
  },
  {
    "regionCode": "ES0005",
    "name": "ヘレス"
  },
  {
    "regionCode": "ES0006",
    "name": "ラ・マンチャ"
  },
  {
    "regionCode": "ES0007",
    "name": "プリオラート"
  },
  {
    "regionCode": "ES0008",
    "name": "ペネデス"
  },
  {
    "regionCode": "FR0001",
    "name": "ボルドー"
  },
  {
    "regionCode": "FR0002",
    "name": "ブルゴーニュ"
  },
  {
    "regionCode": "FR0003",
    "name": "シャンパーニュ"
  },
  {
    "regionCode": "FR0004",
    "name": "アルザス地方"
  },
  {
    "regionCode": "FR0005",
    "name": "ロワール"
  },
  {
    "regionCode": "FR0006",
    "name": "コート・デュ・ローヌ"
  },
  {
    "regionCode": "FR0007",
    "name": "ジュラ/サヴォワ"
  },
  {
    "regionCode": "FR0008",
    "name": "シュッド・ウエスト"
  },
  {
    "regionCode": "FR0009",
    "name": "ラングドック/ルーション"
  },
  {
    "regionCode": "FR0010",
    "name": "プロヴァンス/コルシカ島"
  },
  {
    "regionCode": "IT0001",
    "name": "ピエモンテ"
  },
  {
    "regionCode": "IT0002",
    "name": "ロンバルディア"
  },
  {
    "regionCode": "IT0003",
    "name": "ヴェネト"
  },
  {
    "regionCode": "IT0004",
    "name": "トスカーナ"
  },
  {
    "regionCode": "IT0005",
    "name": "カンパーニャ"
  },
  {
    "regionCode": "JP0001",
    "name": "山梨県"
  },
  {
    "regionCode": "JP0002",
    "name": "北海道"
  },
  {
    "regionCode": "JP0003",
    "name": "長野県"
  },
  {
    "regionCode": "JP0004",
    "name": "山形県"
  },
  {
    "regionCode": "NZ0001",
    "name": "カンタベリー"
  },
  {
    "regionCode": "NZ0002",
    "name": "ワイカト"
  },
  {
    "regionCode": "NZ0003",
    "name": "ギズボーン"
  },
  {
    "regionCode": "NZ0004",
    "name": "ホークス・ベイ"
  },
  {
    "regionCode": "NZ0005",
    "name": "ウエリントン"
  },
  {
    "regionCode": "NZ0006",
    "name": "マールボロ"
  },
  {
    "regionCode": "NZ0007",
    "name": "セントラル・オタゴ"
  },
  {
    "regionCode": "US0001",
    "name": "ナパ・ヴァレー"
  },
  {
    "regionCode": "US0002",
    "name": "サンタクララ"
  },
  {
    "regionCode": "US0003",
    "name": "ソノマ"
  },
  {
    "regionCode": "US0004",
    "name": "オレゴン"
  },
  {
    "regionCode": "US0005",
    "name": "ワシントン"
  },
  {
    "regionCode": "US0006",
    "name": "モントレー"
  },
  {
    "regionCode": "US0007",
    "name": "サンタ・バーバラ"
  },
  {
    "regionCode": "US0008",
    "name": "シエラ・フットヒルズ"
  },
  {
    "regionCode": "US0009",
    "name": "サウス・コースト"
  },
  {
    "regionCode": "US0010",
    "name": "ニューヨーク"
  },
  {
    "regionCode": "ZA0001",
    "name": "コンスタンシア"
  },
  {
    "regionCode": "ZA0002",
    "name": "パール"
  },
  {
    "regionCode": "ZA0003",
    "name": "ステレンボッシュ"
  },
  {
    "regionCode": "ZA0004",
    "name": "オリファンツ・リヴァー"
  },
  {
    "regionCode": "ZA0005",
    "name": "ブレーダ・リヴァー"
  },
  {
    "regionCode": "ZA0006",
    "name": "クライン・カルー"
  }
]
~~~

~~~
ブドウ品種:

[
  {
    "grapeVarietyCode": "R0001",
    "name": "カベルネ・ソーヴィニヨン",
    "description": "「黒ブドウの王様」とも呼ばれ、世界中で栽培されている代表的品種。重厚で長期成熟に耐えうるワインを生む。ボルドーではエレガントは味わいに、カリフォルニアなどの新世界ではパワフルな味わいとなる。",
    "wineColor": {
      "colorId": "C0001",
      "name": "赤",
      "description": "果皮や種子を一緒に発行させ、果皮から色素を引き出したワイン。主に黒みがかった紫色の果皮を持つ黒ブドウから造られる。種子から引き出されたタンニンによる渋味をもつ。"
    }
  },
  {
    "grapeVarietyCode": "R0002",
    "name": "メルロー",
    "description": "「ビロードのような舌触り」とも表現される、滑らかさをもち、渋味もやわらかい。カベルネ・ソーヴィニヨンと並んでボルドーを代表する品種。世界各地でもハイクオリティのワインが生まれている。",
    "wineColor": {
      "colorId": "C0001",
      "name": "赤",
      "description": "果皮や種子を一緒に発行させ、果皮から色素を引き出したワイン。主に黒みがかった紫色の果皮を持つ黒ブドウから造られる。種子から引き出されたタンニンによる渋味をもつ。"
    }
  },
  {
    "grapeVarietyCode": "R0003",
    "name": "ネッビオーロ",
    "description": "北イタリア、ピエモンテ産でイタリアを代表するワイン、バローロ、バルバレスコを生み出すブドウ品種。強い酸味と渋味をもち、長期熟成型のワインとなる。熟成によって酸味と果実味のバランスがとれている。",
    "wineColor": {
      "colorId": "C0001",
      "name": "赤",
      "description": "果皮や種子を一緒に発行させ、果皮から色素を引き出したワイン。主に黒みがかった紫色の果皮を持つ黒ブドウから造られる。種子から引き出されたタンニンによる渋味をもつ。"
    }
  },
  {
    "grapeVarietyCode": "R0004",
    "name": "カベルネ・フラン",
    "description": "ボルドーにおいては、カベルネ・ソーヴィニヨンやメルローとブレンドされることが多いブドウ品種。酸味が中心でしなやかな渋味をもつスムーズなワインとなる。薄めで明るい色調も特徴のひとつ。",
    "wineColor": {
      "colorId": "C0001",
      "name": "赤",
      "description": "果皮や種子を一緒に発行させ、果皮から色素を引き出したワイン。主に黒みがかった紫色の果皮を持つ黒ブドウから造られる。種子から引き出されたタンニンによる渋味をもつ。"
    }
  },
  {
    "grapeVarietyCode": "R0005",
    "name": "テンプラリーニョ",
    "description": "スペインを代表する固有品種。伝統的に高品質なワインを生み出してきた。リオハをはじめスペイン各地で栽培されており、多くのシノニムをもつ。古くなるとピノ・ノワールのワインに似てくる。",
    "wineColor": {
      "colorId": "C0001",
      "name": "赤",
      "description": "果皮や種子を一緒に発行させ、果皮から色素を引き出したワイン。主に黒みがかった紫色の果皮を持つ黒ブドウから造られる。種子から引き出されたタンニンによる渋味をもつ。"
    }
  },
  {
    "grapeVarietyCode": "R0006",
    "name": "ピノ・ノワール",
    "description": "ブルゴーニュで数々の高名なワインを生み出すブドウ品種。世界各地でも栽培されており、テロワールを反映しやすい。単一品種で造られ、繊細でスムーズな味わいのワインとなる。比較的高価なワインが多い。",
    "wineColor": {
      "colorId": "C0001",
      "name": "赤",
      "description": "果皮や種子を一緒に発行させ、果皮から色素を引き出したワイン。主に黒みがかった紫色の果皮を持つ黒ブドウから造られる。種子から引き出されたタンニンによる渋味をもつ。"
    }
  },
  {
    "grapeVarietyCode": "R0007",
    "name": "サンジョヴェーゼ",
    "description": "キアンティ・クラッシコをはじめ、多くの有名ワインを生み出すイタリアの代表品種。はっきりとした酸味とフルーツフレーバーをもつワインとなる。",
    "wineColor": {
      "colorId": "C0001",
      "name": "赤",
      "description": "果皮や種子を一緒に発行させ、果皮から色素を引き出したワイン。主に黒みがかった紫色の果皮を持つ黒ブドウから造られる。種子から引き出されたタンニンによる渋味をもつ。"
    }
  },
  {
    "grapeVarietyCode": "R0008",
    "name": "ガメイ",
    "description": "ブルゴーニュのボージョレを代表するブドウ品種。ヌーヴォーが有名。フルーティーな早飲みタイプのイメージが強いが、芳酵な味わいのワインも生み出す。",
    "wineColor": {
      "colorId": "C0001",
      "name": "赤",
      "description": "果皮や種子を一緒に発行させ、果皮から色素を引き出したワイン。主に黒みがかった紫色の果皮を持つ黒ブドウから造られる。種子から引き出されたタンニンによる渋味をもつ。"
    }
  },
  {
    "grapeVarietyCode": "R0009",
    "name": "マスカット・ベリーA",
    "description": "新潟県のブドウ栽培家・川上善兵衛氏が、ベリー種にマスカット・ハンブルグ種を掛け合わせて作った日本独自の交配品種。濃厚なフルーツフレーバーをもつ。",
    "wineColor": {
      "colorId": "C0001",
      "name": "赤",
      "description": "果皮や種子を一緒に発行させ、果皮から色素を引き出したワイン。主に黒みがかった紫色の果皮を持つ黒ブドウから造られる。種子から引き出されたタンニンによる渋味をもつ。"
    }
  },
  {
    "grapeVarietyCode": "R0010",
    "name": "ジンファンデル",
    "description": "カリフォルニアを代表する品種。濃厚な果実味とインパクトのある味わいのパワフルな赤ワインとなる。ロゼ仕立てのホワイトジンファンデルなど、さまざまなタイプのワインが造られている。",
    "wineColor": {
      "colorId": "C0001",
      "name": "赤",
      "description": "果皮や種子を一緒に発行させ、果皮から色素を引き出したワイン。主に黒みがかった紫色の果皮を持つ黒ブドウから造られる。種子から引き出されたタンニンによる渋味をもつ。"
    }
  },
  {
    "grapeVarietyCode": "R0011",
    "name": "シラー",
    "description": "渋味はしっかりとあるが、高いアルコールのボリューム感で控えめな印象となる。フランスのコート・デュ・ローヌに比べ、オーストラリアではより凝縮感のあるパワフルなタイプが多い。スパイシーな香りも特徴。",
    "wineColor": {
      "colorId": "C0001",
      "name": "赤",
      "description": "果皮や種子を一緒に発行させ、果皮から色素を引き出したワイン。主に黒みがかった紫色の果皮を持つ黒ブドウから造られる。種子から引き出されたタンニンによる渋味をもつ。"
    }
  },
  {
    "grapeVarietyCode": "R0012",
    "name": "マルベック",
    "description": "フランスと新世界で特徴が大きく異なる品種。フランスでは別名「黒いワイン」と呼ばれ、シャープで濃厚な味わいに。アルゼンチンなどの新世界ではフルーティで果実味豊かなワインになる。",
    "wineColor": {
      "colorId": "C0001",
      "name": "赤",
      "description": "果皮や種子を一緒に発行させ、果皮から色素を引き出したワイン。主に黒みがかった紫色の果皮を持つ黒ブドウから造られる。種子から引き出されたタンニンによる渋味をもつ。"
    }
  },
  {
    "grapeVarietyCode": "R0013",
    "name": "グルナッシュ",
    "description": "フランス南部で広く栽培されている品種。甘味のある豊かなフルーツフレーバーをもつフルボディのワインとなる。原産地のスペインではガルナッチャ・ティンタと呼ばれる。",
    "wineColor": {
      "colorId": "C0001",
      "name": "赤",
      "description": "果皮や種子を一緒に発行させ、果皮から色素を引き出したワイン。主に黒みがかった紫色の果皮を持つ黒ブドウから造られる。種子から引き出されたタンニンによる渋味をもつ。"
    }
  },
  {
    "grapeVarietyCode": "R0014",
    "name": "ピノタージュ",
    "description": "ピノ・ノワールとサンソーを掛け合わせた、南アフリカを代表する独自の交配品種。ピノ・ノワールとシラーを足して２で割ったようなスムーズで力強い味わいが特徴。",
    "wineColor": {
      "colorId": "C0001",
      "name": "赤",
      "description": "果皮や種子を一緒に発行させ、果皮から色素を引き出したワイン。主に黒みがかった紫色の果皮を持つ黒ブドウから造られる。種子から引き出されたタンニンによる渋味をもつ。"
    }
  },
  {
    "grapeVarietyCode": "W0001",
    "name": "シャルドネ",
    "description": "「白ブドウの女王」とも呼ばれ、世界中で栽培されている白ブドウの代表品種。品種による香りはおとなしい。熟成にともない色調は黄色に変化し、酸味と果実味が落ち着いてもったりとした味わいになる。",
    "wineColor": {
      "colorId": "C0002",
      "name": "白",
      "description": "果皮や種子を先に取り除き、果汁だけを発酵させて造られるワイン。黄緑色や薄いピンク色の果皮を持つ白ブドウを原料とすることが多いが、黒ブドウから造られるものもある。"
    }
  },
  {
    "grapeVarietyCode": "W0002",
    "name": "ソーヴィニヨン・ブラン",
    "description": "青みを帯びた香りが特徴だが、温暖な産地では、リンゴや洋ナシの甘酸っぱい香りに、さらに温暖になるとトロピカルフルーツの香りが出てくる。熟成とともに色調は濃い黄色に変化し、まったりとした味わいになる。",
    "wineColor": {
      "colorId": "C0002",
      "name": "白",
      "description": "果皮や種子を先に取り除き、果汁だけを発酵させて造られるワイン。黄緑色や薄いピンク色の果皮を持つ白ブドウを原料とすることが多いが、黒ブドウから造られるものもある。"
    }
  },
  {
    "grapeVarietyCode": "W0003",
    "name": "リースリング",
    "description": "酸味と甘味、果実味のバランスが味わいの決め手となる品種。ドイツやフランスのアルザスをはじめ、各国で辛口から極甘口タイプまで造られている。極甘口の色調は黄色。極甘口以外は早飲みタイプが多い。",
    "wineColor": {
      "colorId": "C0002",
      "name": "白",
      "description": "果皮や種子を先に取り除き、果汁だけを発酵させて造られるワイン。黄緑色や薄いピンク色の果皮を持つ白ブドウを原料とすることが多いが、黒ブドウから造られるものもある。"
    }
  },
  {
    "grapeVarietyCode": "W0004",
    "name": "ピノ・グリ",
    "description": "灰色がかったピンク色の果皮を持つグリ品種。フランスのアルザスでは豊かなボディのワインとなり、イタリアでは軽やかな味わいとなる。早飲みタイプが多い。",
    "wineColor": {
      "colorId": "C0002",
      "name": "白",
      "description": "果皮や種子を先に取り除き、果汁だけを発酵させて造られるワイン。黄緑色や薄いピンク色の果皮を持つ白ブドウを原料とすることが多いが、黒ブドウから造られるものもある。"
    }
  },
  {
    "grapeVarietyCode": "W0005",
    "name": "ミュスカデ",
    "description": "シュール・リーが行われることが多く、イーストの香りはこの製法によるもの。フレッシュで軽やかな味わいが特徴で、早飲みタイプが多い。",
    "wineColor": {
      "colorId": "C0002",
      "name": "白",
      "description": "果皮や種子を先に取り除き、果汁だけを発酵させて造られるワイン。黄緑色や薄いピンク色の果皮を持つ白ブドウを原料とすることが多いが、黒ブドウから造られるものもある。"
    }
  },
  {
    "grapeVarietyCode": "W0006",
    "name": "トロンテス",
    "description": "アルゼンチン独特の白ワインの味わいを確立した主要品種。マスカットに似たニュアンスのフルーティな香りと軽快な酸味をもち、早飲みタイプが多い。",
    "wineColor": {
      "colorId": "C0002",
      "name": "白",
      "description": "果皮や種子を先に取り除き、果汁だけを発酵させて造られるワイン。黄緑色や薄いピンク色の果皮を持つ白ブドウを原料とすることが多いが、黒ブドウから造られるものもある。"
    }
  },
  {
    "grapeVarietyCode": "W0007",
    "name": "甲州",
    "description": "日本を代表する品種。早飲みタイプが多い。香りや味わいが穏やかで個性に乏しいとされ、大半が甘口であったが、近年品質が向上し多彩な辛口ワインが生まれている。",
    "wineColor": {
      "colorId": "C0002",
      "name": "白",
      "description": "果皮や種子を先に取り除き、果汁だけを発酵させて造られるワイン。黄緑色や薄いピンク色の果皮を持つ白ブドウを原料とすることが多いが、黒ブドウから造られるものもある。"
    }
  },
  {
    "grapeVarietyCode": "W0008",
    "name": "ヴィオニエ",
    "description": "コート・デュ・ローヌのほか、世界各地でも栽培されている。「クリスピーな」と表現される、乾いたニュアンスのほのかな酸味をもつのも特徴。熟成にともない色調はゴールドになり、粘性が強くなる。",
    "wineColor": {
      "colorId": "C0002",
      "name": "白",
      "description": "果皮や種子を先に取り除き、果汁だけを発酵させて造られるワイン。黄緑色や薄いピンク色の果皮を持つ白ブドウを原料とすることが多いが、黒ブドウから造られるものもある。"
    }
  },
  {
    "grapeVarietyCode": "W0009",
    "name": "セミヨン",
    "description": "ボルドーのソーテルヌやグラーヴの主要品種で、貴腐ワインの原料ブドウとしても有名。酸味と果実味は控えめ。辛口の場合、単体で造られることは珍しく、ソーヴィニヨン・ブランとのブレンドが一般的。",
    "wineColor": {
      "colorId": "C0002",
      "name": "白",
      "description": "果皮や種子を先に取り除き、果汁だけを発酵させて造られるワイン。黄緑色や薄いピンク色の果皮を持つ白ブドウを原料とすることが多いが、黒ブドウから造られるものもある。"
    }
  },
  {
    "grapeVarietyCode": "W0010",
    "name": "シュナン・ブラン",
    "description": "辛口から遅摘みや貴腐による甘口まであり、辛口でも蜂蜜のような甘い花の香りとフルーツフレーバーにより、余韻に甘味を感じる味わいとなる。早飲みタイプが多いが、一部は熟成にともない粘性が強くなる。",
    "wineColor": {
      "colorId": "C0002",
      "name": "白",
      "description": "果皮や種子を先に取り除き、果汁だけを発酵させて造られるワイン。黄緑色や薄いピンク色の果皮を持つ白ブドウを原料とすることが多いが、黒ブドウから造られるものもある。"
    }
  },
  {
    "grapeVarietyCode": "W0011",
    "name": "ゲヴュルツトラミネール",
    "description": "華やかなライチの香りで、すぐにゲヴュルツトラミネールのワインだと判別できるほどのはっきりとした個性をもつ。極甘口のデザートワインを除き、早飲みタイプが多い。",
    "wineColor": {
      "colorId": "C0002",
      "name": "白",
      "description": "果皮や種子を先に取り除き、果汁だけを発酵させて造られるワイン。黄緑色や薄いピンク色の果皮を持つ白ブドウを原料とすることが多いが、黒ブドウから造られるものもある。"
    }
  },
  {
    "grapeVarietyCode": "W0012",
    "name": "ルーサンヌ",
    "description": "コート・デュ・ローヌの主要品種。ふたつをブレンドすることにより複雑な味わいのワインとなる。熟成にともない色調は黄色が濃くなり、ねっとりとした個性的な味わいに。",
    "wineColor": {
      "colorId": "C0002",
      "name": "白",
      "description": "果皮や種子を先に取り除き、果汁だけを発酵させて造られるワイン。黄緑色や薄いピンク色の果皮を持つ白ブドウを原料とすることが多いが、黒ブドウから造られるものもある。"
    }
  },
  {
    "grapeVarietyCode": "W0013",
    "name": "シルヴァネール",
    "description": "ドイツのフランケン地方の辛口白ワインが有名。酸味の強いワインとなることが多く、早飲みタイプが多い。フランスのアルザスではフルボディのワインが造られる。",
    "wineColor": {
      "colorId": "C0002",
      "name": "白",
      "description": "果皮や種子を先に取り除き、果汁だけを発酵させて造られるワイン。黄緑色や薄いピンク色の果皮を持つ白ブドウを原料とすることが多いが、黒ブドウから造られるものもある。"
    }
  },
  {
    "grapeVarietyCode": "W0014",
    "name": "マスカット",
    "description": "世界中に多くの親戚品種があり、マスカットファミリーとも呼ばれる。辛口、甘口、極甘口とも、軽やかな味わいと甘味のある香りが特徴で、早飲みタイプが多い。",
    "wineColor": {
      "colorId": "C0002",
      "name": "白",
      "description": "果皮や種子を先に取り除き、果汁だけを発酵させて造られるワイン。黄緑色や薄いピンク色の果皮を持つ白ブドウを原料とすることが多いが、黒ブドウから造られるものもある。"
    }
  },
  {
    "grapeVarietyCode": "W0015",
    "name": "マカベオ",
    "description": "ペインか、あるいは小アジアいずれかが原産地ではないかといわれ、原産地が特定されていない。現在では主にスペイン北部で栽培されている。カタルーニャ州ではマカベオまたはマカベウ、リオハやナバーラ、アラゴン州ではビウラと土地によって呼び方が異なる。若飲み用にも長期熟成にも耐えうる高級品種。特徴的には、豊かな芳香があり、また骨格をワインに与え、かすかな苦みが風味にある。産地によってかんきつ類の果実の香りや花の香りのあるものから、ミネラルな印象を与えるものまで幅がある。カタルーニャ州では主にカバに使用され、リオハでは小樽発酵の白ワインとなる。",
    "wineColor": {
      "colorId": "C0002",
      "name": "白",
      "description": "果皮や種子を先に取り除き、果汁だけを発酵させて造られるワイン。黄緑色や薄いピンク色の果皮を持つ白ブドウを原料とすることが多いが、黒ブドウから造られるものもある。"
    }
  },
  {
    "grapeVarietyCode": "W0016",
    "name": "パレリャーダ",
    "description": "カタルーニャ地方に古くから根付いてきたこの地方の固有品種。19世紀末に、カバのメーカー「コドルニュ」のホセ・ラベントスによって、高品質なカバには欠かせない品種として採用されるようになった。主として標高300～600メートルの土地で栽培され、芽吹きが早いためにしばしば霜に遭いやすく、栽培が難しい品種でもある。遅く熟す品種だが、収穫時の果皮はまだ緑色をし、酸度もしっかりしている。花の香りに富み、カバに優雅さや柔らかさを加える。単独でも白ワインが造られるようになってきた。やや熟したアロマを感じさせるが、ボディのしっかりした白ワインとなる。",
    "wineColor": {
      "colorId": "C0002",
      "name": "白",
      "description": "果皮や種子を先に取り除き、果汁だけを発酵させて造られるワイン。黄緑色や薄いピンク色の果皮を持つ白ブドウを原料とすることが多いが、黒ブドウから造られるものもある。"
    }
  },
  {
    "grapeVarietyCode": "W0017",
    "name": "チャレッロ",
    "description": "スペインへはギリシャ人などの地中海を航行する船によって運ばれ、ローマ人によって栽培とワイン造りが広がった品種。マカベオ種、パレリャーダ種と並ぶカバの3大主要品種となっている。病害にも強いために安定した生産性をもっている。ぶどうは金色に近い黄色で、房が小さめで皮が厚い。果皮を口に含めば甘く、また酸度もある。単一で白ワインを造るとボディがしっかりしており、わずかに渋味を感じることもあるが、理想的なアルコール度数に達する。カバ主要品種のマカベオ、パレリャーダと共にブレンドすることで補完される。",
    "wineColor": {
      "colorId": "C0002",
      "name": "白",
      "description": "果皮や種子を先に取り除き、果汁だけを発酵させて造られるワイン。黄緑色や薄いピンク色の果皮を持つ白ブドウを原料とすることが多いが、黒ブドウから造られるものもある。"
    }
  }
]
~~~

~~~
風味:

[
  {
    "tasteCode": "T0001",
    "description": "ライトボディ"
  },
  {
    "tasteCode": "T0002",
    "description": "ミディアムボディ"
  },
  {
    "tasteCode": "T0003",
    "description": "フルボディ"
  },
  {
    "tasteCode": "T0004",
    "description": "甘口"
  },
  {
    "tasteCode": "T0005",
    "description": "中口"
  },
  {
    "tasteCode": "T0006",
    "description": "辛口"
  }
]
~~~

# 参考資料
・ワイン情報

[最新版　ワイン完全バイブル　井手勝茂監修](https://www.amazon.co.jp/最新版-ワイン完全バイブル-井手-勝茂/dp/4816353542/)

## [基本機能] TODO:
* ユーザ管理(登録/変更/削除) API
* ユーザ検索 API
* ユーザ認証 API
* 仮想ワインセラー API
* ワイン情報管理(登録/変更/削除) API
* ワイン情報検索 API
* 在庫管理(登録/変更/削除) API
* 在庫情報検索 API
* シリアル管理(発行/変更/削除) API
* シリアル情報検索 API
