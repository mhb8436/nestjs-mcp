# 뉴스 검색 서비스 (News MCP)

News API를 사용하여 뉴스 기사를 검색하고 제공하는 MCP 서비스입니다.

## 기능

- 키워드 기반 뉴스 검색
- 카테고리별 뉴스 필터링
- 최신 뉴스 조회
- 국가별 뉴스 필터링

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
NEWS_API_KEY=your_api_key_here
```

News API 키는 [News API](https://newsapi.org/)에서 발급받을 수 있습니다.

### 실행

```bash
npm run start:dev
```

## API 엔드포인트

- `POST /mcp/tools/search-news`: 뉴스 검색
- `POST /mcp/tools/get-top-headlines`: 최신 헤드라인 뉴스 조회

## 사용 예시

### 뉴스 검색

```json
{
  "query": "artificial intelligence",
  "category": "technology",
  "language": "en",
  "pageSize": 10
}
```

### 최신 헤드라인 뉴스 조회

```json
{
  "country": "kr",
  "category": "technology",
  "pageSize": 5
}
```
