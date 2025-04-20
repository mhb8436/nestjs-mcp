# MCP (Model Context Protocol) 프로젝트

이 저장소는 MCP를 사용한 다양한 서비스 구현 예제를 포함하고 있습니다.

## 프로젝트 구조

- `book-mcp`: 도서 검색 서비스
- `movie-mcp`: 영화 검색 서비스
- `news-mcp`: 뉴스 검색 서비스
- `weather-mcp`: 날씨 정보 서비스

## 시작하기

각 서비스 디렉토리에서 다음 명령어를 실행하여 서비스를 시작할 수 있습니다:

```bash
npm install
npm run start:dev
```

## 환경 설정

각 서비스는 `.env` 파일을 통해 필요한 API 키를 설정해야 합니다. 자세한 내용은 각 서비스의 README.md를 참조하세요.

## 기술 스택

- NestJS
- TypeScript
- MCP (Model Context Protocol)
- Zod (타입 검증)
