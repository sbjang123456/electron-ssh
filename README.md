# Electron SSH

Electron 기반의 SSH 클라이언트 애플리케이션입니다.

## 기술 스택

- **Framework**: Electron + electron-vite
- **Language**: TypeScript
- **Architecture**: Feature-Sliced Design (FSD)
- **UI**: React 19 + shadcn/ui + Tailwind CSS
- **SSH**: ssh2
- **Terminal**: xterm.js
- **State Management**: Zustand
- **Form**: React Hook Form + Zod
- **Code Quality**: Biome, Commitlint, Husky, Lint-staged

## 주요 기능

- SSH 연결 관리 (생성, 수정, 삭제)
- Password 및 Private Key 인증 지원
- 다중 터미널 세션 (탭 기반)
- 연결 정보 암호화 저장 (electron safeStorage)

## 프로젝트 구조

```
src/
├── main/                    # Electron Main Process
│   ├── ipc/                 # IPC 핸들러
│   └── services/            # SSH, Storage 서비스
├── preload/                 # Preload Scripts
└── renderer/                # Renderer (React + FSD)
    ├── app/                 # App 설정, 프로바이더, 라우터
    ├── pages/               # 페이지 컴포넌트
    ├── widgets/             # 위젯 (터미널, 연결 목록 등)
    ├── features/            # 기능 (연결, 삭제 등)
    ├── entities/            # 엔티티 (Connection, Session)
    └── shared/              # 공용 UI, 유틸리티
```

## 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 모드 실행
pnpm dev

# 빌드
pnpm build

# 플랫폼별 패키징
pnpm build:mac
pnpm build:win
pnpm build:linux
```

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 모드 실행 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm lint` | Biome 린트 검사 |
| `pnpm lint:fix` | Biome 린트 자동 수정 |
| `pnpm format` | Biome 포맷 검사 |
| `pnpm format:fix` | Biome 포맷 자동 수정 |
| `pnpm check` | Biome 통합 검사 |
| `pnpm check:fix` | Biome 통합 자동 수정 |

## 커밋 컨벤션

[Conventional Commits](https://www.conventionalcommits.org/) 규칙을 따릅니다.

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 변경
style: 코드 포맷팅
refactor: 코드 리팩토링
perf: 성능 개선
test: 테스트 추가/수정
build: 빌드 관련 변경
ci: CI 설정 변경
chore: 기타 변경
```

## 라이선스

MIT
