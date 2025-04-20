# 날씨 정보 서비스 (Weather MCP)

OpenWeatherMap API를 사용하여 날씨 정보를 제공하는 MCP 서비스입니다.

## 기능

- 현재 날씨 정보 조회
- 위치 기반 날씨 검색
- 다양한 단위 시스템 지원 (metric/imperial)
- 다국어 지원

## 시작하기

### 필수 요구사항

- Node.js 16+
- npm 또는 yarn

### 설치

```bash
npm install
```

### 환경 설정

`.env` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
OPENWEATHER_API_KEY=your_api_key_here
```

OpenWeatherMap API 키는 [OpenWeatherMap](https://openweathermap.org/)에서 발급받을 수 있습니다.

### 실행

```bash
npm run start:dev
```

## API 엔드포인트

- `POST /mcp/tools/get-current-weather`: 현재 날씨 정보 조회
- `POST /mcp/tools/get-forecast`: 날씨 예보 조회

## 사용 예시

### 현재 날씨 조회

```json
{
  "location": "Seoul",
  "units": "metric",
  "lang": "ko"
}
```

### 날씨 예보 조회

```json
{
  "location": "Tokyo",
  "units": "metric",
  "days": 5
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
