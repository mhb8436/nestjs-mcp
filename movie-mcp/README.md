# 날씨 정보 MCP 서버

이 프로젝트는 NestJS로 구현된 날씨 정보 MCP(Multi-Context Protocol) 서버입니다. OpenWeatherMap API를 사용하여 현재 날씨 정보를 제공합니다.

## 기능

- 현재 날씨 정보 조회
- 위치 기반 날씨 검색
- 다양한 단위 시스템 지원 (metric/imperial)
- 다국어 지원

## 설치 방법

1. 저장소 클론

```bash
git clone [repository-url]
cd personal-assistant
```

2. 의존성 설치

```bash
npm install
```

3. 환경 변수 설정
   `.env` 파일을 생성하고 다음 내용을 추가합니다:

```
OPENWEATHER_API_KEY=your_api_key_here
PORT=3000
```

## 실행 방법

개발 모드로 실행:

```bash
npm run start:dev
```

프로덕션 모드로 실행:

```bash
npm run build
npm run start:prod
```

## API 사용 방법

### 현재 날씨 조회

**엔드포인트:** `POST /weather/current`

**요청 본문:**

```json
{
  "location": "Seoul",
  "units": "metric",
  "lang": "ko"
}
```

**응답:**

```json
{
  "temperature": 15.5,
  "feelsLike": 14.2,
  "humidity": 65,
  "windSpeed": 3.5,
  "description": "맑음",
  "icon": "01d",
  "location": "Seoul, KR",
  "timestamp": "2024-03-21T10:30:00.000Z"
}
```

## Claude 데스크톱 앱 연동 방법

1. Claude 데스크톱 앱을 실행합니다.
2. 설정 > MCP 서버 설정으로 이동합니다.
3. "서버 추가" 버튼을 클릭합니다.
4. 다음 정보를 입력합니다:
   - 서버 이름: Weather MCP
   - 서버 URL: http://localhost:3000
   - API 키: (필요한 경우)

## 기술 스택

- NestJS
- TypeScript
- OpenWeatherMap API
- Axios
- class-validator
- class-transformer

## 라이센스

MIT
