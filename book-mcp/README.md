# 도서 검색 서비스 (Book MCP)

Google Books API를 사용하여 도서 정보를 검색하고 상세 정보를 제공하는 MCP 서비스입니다.

## 기능

- 도서 제목, 저자, ISBN으로 검색
- 도서 상세 정보 조회
- 검색 결과 필터링 및 정렬

## 시작하기

### 필수 요구사항

- Node.js 16+
- npm 또는 yarn

### 설치

```bash
npm install
```

### 환경 설정

Google Books API는 API 키가 필요하지 않습니다.

### 실행

```bash
npm run start:dev
```

## API 엔드포인트

- `POST /mcp/tools/search-books`: 도서 검색
- `POST /mcp/tools/get-book-details`: 도서 상세 정보 조회

## 사용 예시

### 도서 검색

```json
{
  "query": "Harry Potter",
  "author": "J.K. Rowling",
  "maxResults": 10
}
```

### 도서 상세 정보 조회

```json
{
  "bookId": "book_id_here"
}
```
