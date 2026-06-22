# Saju Fortune Calendar

Expo 기반 사주/만세력 앱입니다. 생년월일시와 양력/음력을 기준으로 사주 팔자, 오행 분포, 관계/운세 화면을 확인할 수 있습니다.

## 개발 환경

- Node.js 20 이상 권장
- npm
- VS Code 같은 코드 편집기

이 프로젝트는 Expo를 사용합니다. 모바일 기기 없이도 브라우저에서 바로 확인할 수 있고, 앱 내부에 `Playground` 탭이 있어서 입력값을 바꾸며 결과를 즉시 볼 수 있습니다.

## 설치

```bash
npm install
```

웹 미리보기를 처음 실행하는 경우 아래 패키지가 필요합니다.

```bash
npx expo install react-dom react-native-web
```

## 실행 방법

### 1) 앱 서버 실행

```bash
npm start
```

실행 후 Expo Dev Tools에서 원하는 대상에 접속합니다.

- 휴대폰: Expo Go로 QR 스캔
- iOS 시뮬레이터: `i`
- Android 에뮬레이터: `a`
- 웹 브라우저: `w`

### 2) 브라우저에서만 개발하기

모바일 없이 코드 편집기 + 브라우저로 작업할 때는 웹 모드가 가장 편합니다.

```bash
npm run web
```

브라우저에서 앱 화면을 띄워두고 VS Code에서 코드를 수정하면 `Fast Refresh`로 바로 반영됩니다.

### 3) 타입 체크

```bash
npm run typecheck
```

## 앱 사용 방법

앱이 처음 열리면 온보딩 화면에서 내 프로필을 입력합니다.

주요 화면은 하단 탭으로 이동합니다.

- `홈`: 요약 화면
- `캘린더`: 날짜 기반 운세
- `관계`: 관계 분석
- `리더보드`: 비교/순위 화면
- `마이`: 내 프로필과 만세력 결과

개발 모드에서는 `Playground` 탭이 추가됩니다.

- 생년월일시, 양/음력, 출생지를 바꾸면 만세력 표가 즉시 갱신됩니다.
- `Apply to app` 버튼으로 현재 입력값을 실제 앱 프로필로 저장할 수 있습니다.

## 프로젝트 구조

- `src/App.tsx`: 앱 루트, 탭 전환, 개발용 `Playground` 연결
- `src/screens/`: 각 화면 컴포넌트
- `src/components/`: 공통 UI
- `src/lib/`: 사주 계산, 저장소, 상태 관리
- `src/types/`: 타입 정의

## 참고 사항

- 사주 계산은 `manseryeok`를 사용합니다.
- 현재 Expo 환경에서는 패키지 루트 진입점 대신 내부 `dist` 파일을 직접 참조하는 방식으로 연결돼 있습니다.
- 웹 실행 중 포트 충돌이 나면 Expo가 다른 포트를 제안합니다. 그 포트를 그대로 사용해도 됩니다.

## 자주 보는 문제

### `Unable to resolve module ./time/true-solar-time`

대개 `manseryeok` 또는 웹용 의존성이 완전히 설치되지 않았을 때 나옵니다.

다음 순서로 확인합니다.

```bash
npm install
npx expo install react-dom react-native-web
npm run web
```

### 화면이 바로 반영되지 않을 때

Expo 캐시를 지우고 다시 시작합니다.

```bash
npx expo start -c
```
