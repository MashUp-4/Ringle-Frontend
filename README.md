# Ringle Frontend

MashUp 4팀의 React·TypeScript 프런트엔드입니다. 구현 기준은 Notion의 [[최종] 기능명세서](https://app.notion.com/p/3e4ac01f4e5c80578af4d0a4e15ddd38) F-01~F-07의 API 연동 범위입니다.

## 실행 및 검증

```sh
npm ci
npm run dev
npm run test:api
npm run build
npm run lint
npm run format:check
```

커밋된 package-lock.json으로 설치합니다. Vite 개발 서버와 Vercel 배포는 `/backend`를 `https://ringle-backend.onrender.com`에 프록시합니다. 공개 설정은 `.env.example`을 참고합니다.

## 연동 범위

기존 화면의 배치·스타일·클릭 동작을 유지하고, 홈 추천·예정 수업·찜하기·수업 개수를 실제 API 데이터에 연결합니다. 첫 구매 혜택과 링글 패키지 아래에 기존 예정 수업 또는 추천 영역을 표시합니다.

찜 성공 후 늦게 도착한 조회가 저장 상태를 덮지 않도록 처리하고, 시간대가 없는 서버 시각은 한국 시간으로 해석합니다. 상세 소개·예약 가능 시간 화면, 학교 검색, 실제 결제·예약 생성은 추가하지 않습니다. 예약·구매는 기존 화면 이동·안내 범위를 유지합니다.

## 실제 API 연결

- `GET /tutors`: 전체·추천 목록, 이름·전공 검색, 복합 필터
- `POST/DELETE /users/me/favorite-tutors/{tutorId}`: 실제 ID로 찜 저장·해제
- `GET /users/me/home?category=...`: 예정 수업 또는 맞춤 추천 분기
- `GET /users/me/summary`, `/users/me/profile-image`: 회원·수업권·포인트·쿠폰·프로필 사진
- `GET /users/me/class-counts`: 상단 예정 수업 개수

홈 첫 요청은 category를 생략하여 서버의 가입 목적을 따릅니다. 탭 변경 시 CAREER_INTERVIEW, BUSINESS_ENGLISH, DAILY_DISCUSSION, STUDY_ABROAD_EXAM 중 하나를 전송합니다. 추천은 응답의 앞 2명을 사용하고, 0·1명일 때 임의 데이터를 보충하지 않습니다. 예정 수업이 있으면 실제 수업 카드와 서버 totalCount를 표시합니다. API의 오프셋 없는 시간은 한국 시간으로 해석합니다.

서버 데이터가 비거나 요청이 실패하면 빈 상태·오류·재시도를 표시하며 로컬 데모로 대체하지 않습니다. 검색·필터는 250ms 지연 및 오래된 응답 무시를 사용합니다. 홈도 마지막 선택에 해당하는 응답만 반영합니다. 같은 요청은 진행 중일 때 공유합니다.

찜 저장 중 중복 요청을 막고 실패 시 기존 상태를 유지합니다. 성공한 변경은 홈·목록에서 공유하며, 늦게 도착한 이전 조회나 찜 값이 없는 수업 응답으로 덮지 않습니다. 현재 백엔드는 사용자 ID 1번을 사용합니다.

## 경로

- `/`: 실제 홈 API에 따라 예정 수업 또는 추천 표시
- `/tutors`: 추천 튜터
- `/tutors/all`: 전체 목록과 필터
- `/tutors/all?saved=1`: 서버 찜 목록
- `/tutors/:tutorId`: 기존 목록 기반 팝업
- `/tutors/favorites`: 기존 호환 경로, 쿼리를 유지해 전체 목록으로 이동

기존 `lessons`, `passes` URL 데모 분기는 홈 데이터에 영향을 주지 않습니다.

## 구조와 화면

페이지는 `src/pages`, 공통 화면 요소는 `src/components`, API·타입·훅은 `src/features`에 있습니다. 홈 신규 API는 `features/home/api`, 튜터 서버 연동은 `features/tutors/api`에서 처리합니다.

기존 Figma 기반 색상·간격·타이포그래피, PC 화면 배율과 공통 AppShell을 유지합니다. 튜터 사진은 기존 표시 방식을 유지하며 서버 이미지 URL을 사용하고, 누락·실패 시 중립 아바타를 표시합니다. 오버레이의 유리 효과는 SVG 근사입니다. Modal은 네이티브 dialog를 사용하며 닫을 때 포커스를 복원합니다.

Pretendard Variable 1.3.9는 `public/fonts`에 포함되어 있습니다. [공식 저장소](https://github.com/orioncactus/pretendard/tree/v1.3.9/packages/pretendard)가 출처이며 라이선스는 `public/fonts/OFL.txt`에 있습니다.

## 협업

기능 브랜치는 dev에서 시작하고 dev로 PR을 보냅니다. 팀 리뷰·통합 검증 뒤 main으로 반영합니다. 커밋 접두사는 feat:, fix:, refactor:, docs:, chore:를 사용합니다.

## 느린 서버 조회 대응

- GET 요청은 총 75초 한도 안에서 시도당 최대 45초를 기다립니다. 시간 초과·네트워크 오류·502/503/504에만 1초 뒤 한 번 재시도합니다. 4xx·업무 실패·잘못된 응답은 자동 재시도하지 않습니다.
- 홈·회원·튜터 조회가 8초 이상 걸리면 서버 연결 지연 안내를 표시합니다. 최종 시간 초과·연결 실패·서버 오류 메시지를 구분합니다.
- 같은 GET 경로의 진행 중 요청을 공유하고 성공 결과를 메모리에 30초간 보관합니다(최대 100개). 검색/필터별 URL은 별도 항목이며 새로고침하면 캐시는 사라집니다. 수동 ‘다시 시도’는 캐시를 비우고 재조회합니다.
- POST/DELETE는 기존 30초 제한을 유지하며 자동 재시도하지 않습니다. 저장 시도 후 캐시를 비우고, 저장 전에 시작한 조회가 이전 값으로 캐시를 다시 채우지 못하도록 처리합니다.
- 서버 자체의 기동·DB 지연을 제거하는 변경은 아닙니다. 배포 프록시가 먼저 연결을 종료하면 제한 시간 전에 실패할 수 있습니다. 로그인/계정 전환이 추가되면 사용자 전환 시에도 캐시를 비워야 합니다.

첫 화면에서는 React 마운트 전에 진입 경로에 필요한 조회를 시작하며, 훅과 같은 요청/캐시를 공유합니다. 튜터 첫 조회·수동 재시도에는 250ms 입력 지연을 적용하지 않고, 검색·필터 변경에만 적용합니다. 유효한 캐시가 있으면 첫 렌더에서 바로 사용하며, 캐시가 없으면 실제 응답을 기다리는 동안 스켈레톤을 표시합니다. 이 처리는 서버 통신 시간 자체를 없애거나 첫 방문 응답 시간을 보장하지 않습니다.
