# 🏢 통합 요청 관리 시스템

## 📖 프로젝트 소개

**통합 요청 관리 시스템**은 대학교 및 기업에서 구매 요청과 시설 관리 업무를 효율적으로 처리할 수 있는 **실시간 동기화 웹 애플리케이션**입니다. Firebase를 활용한 실시간 데이터베이스와 PWA 기술로 어디서나 접근 가능한 모바일 친화적인 시스템을 제공합니다.

### 🎯 주요 특징

- 🔥 **실시간 동기화**: Firebase Firestore를 활용한 실시간 데이터 동기화
- 📱 **PWA 지원**: 모바일 앱처럼 설치하여 사용 가능
- 🌐 **오프라인 지원**: 인터넷 연결 없이도 로컬 데이터 저장 및 사용
- 📊 **고급 검색**: 예산, 부서, 상태별 다양한 필터링 옵션
- 📈 **Excel 내보내기**: 요청 데이터를 Excel로 손쉽게 내보내기
- 🎨 **반응형 디자인**: 데스크톱, 태블릿, 모바일 완벽 지원
- 🔐 **보안**: Firebase 보안 규칙을 통한 데이터 보호

---

## 🚀 빠른 시작

### 1️⃣ 파일 구조
```
purchase-request-system/
├── 통합요청시스템.html          # 메인 애플리케이션 파일
├── manifest.json               # PWA 매니페스트
├── sw.js                      # Service Worker
├── firebase-setup.md          # Firebase 설정 가이드
└── README.md                  # 프로젝트 문서
```

### 2️⃣ 로컬 실행
```bash
# 1. 파일 다운로드
git clone <repository-url>
cd purchase-request-system

# 2. 웹 서버로 실행 (Live Server 확장 프로그램 또는)
python -m http.server 8000
# 또는
npx serve .

# 3. 브라우저에서 접속
http://localhost:8000
```

### 3️⃣ Firebase 설정 (실시간 동기화용)
자세한 설정은 [Firebase 설정 가이드](firebase-setup.md)를 참고하세요.

1. Firebase 프로젝트 생성
2. Firestore 데이터베이스 설정
3. `통합요청시스템.html`에서 설정값 교체
4. 웹 호스팅 서비스에 배포

---

## 🎯 주요 기능

### 📋 구매 요청 관리
- **요청 등록**: 제목, 물품명, 수량, 예산, 우선순위 설정
- **견적서 첨부**: PDF, Excel, HWP 파일 업로드 지원
- **자동 기안서 생성**: AI 기반 공문 자동 생성 및 미리보기
- **상태 추적**: 대기 → 진행중 → 완료 → 취소 상태 관리

### 🔧 시설 관리 요청
- **시설 현황 등록**: 시설명, 위치, 문제 상황 기록
- **사진 첨부**: 문제 시설 사진 업로드 (JPG, PNG, GIF)
- **우선순위 설정**: 긴급, 높음, 보통, 낮음 4단계
- **실시간 처리**: 요청 접수부터 완료까지 실시간 추적

### 👨‍💼 관리자 대시보드
- **통합 현황판**: 전체 요청 현황을 한눈에 파악
- **필터링**: 부서별, 상태별, 우선순위별 고급 검색
- **상세 조회**: 개별 요청의 상세 정보 및 첨부파일 확인
- **Excel 내보내기**: 필터된 데이터를 Excel로 내보내기
- **실시간 알림**: 새 요청 등록 시 즉시 알림

### 🔍 고급 검색 및 필터링
- **예산 범위**: 최소/최대 예산으로 검색
- **부서별 필터**: 드롭다운으로 부서 선택
- **담당자 검색**: 요청자명으로 검색
- **날짜 범위**: 등록일 기준 기간 검색
- **상태별 필터**: 대기, 진행중, 완료, 취소 상태별 조회

---

## 🏗️ 기술 스택

### Frontend
- **HTML5/CSS3**: 시맨틱 마크업과 모던 CSS
- **JavaScript (ES6+)**: 비동기 처리 및 모듈 시스템
- **Responsive Design**: 모바일 우선 반응형 웹 디자인

### Backend & Database
- **Firebase Firestore**: 실시간 NoSQL 데이터베이스
- **Firebase Authentication**: 익명 인증 시스템
- **LocalStorage**: 오프라인 데이터 백업

### PWA & Performance
- **Service Worker**: 오프라인 캐싱 및 백그라운드 동기화
- **Web App Manifest**: 네이티브 앱처럼 설치 가능
- **Cache API**: 정적 리소스 캐싱으로 빠른 로딩

### External Libraries
- **SheetJS (xlsx)**: Excel 파일 생성 및 내보내기
- **Firebase SDK**: 실시간 데이터베이스 연동

---

## 📱 PWA (Progressive Web App) 기능

### 설치 및 사용
1. **앱 설치**: 브라우저에서 "앱 설치" 버튼 클릭
2. **홈 화면 추가**: 모바일에서 홈 화면에 아이콘 추가
3. **오프라인 사용**: 인터넷 없이도 기본 기능 사용 가능
4. **백그라운드 동기화**: 연결 복구 시 자동 데이터 동기화

### 바로가기 메뉴
- **구매 요청**: 새 구매 요청 바로 등록
- **시설 관리**: 시설 관리 요청 바로 등록  
- **관리자**: 관리자 대시보드 바로 접근

---

## 🔒 보안 및 권한

### Firebase 보안 규칙
```javascript
// 기본 보안 규칙 (모든 인증 사용자)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /requests/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 관리자 권한
- **로그인**: `admin` / `admin123` (기본값)
- **권한**: 모든 요청 조회, 상태 변경, 데이터 내보내기
- **보안**: 클라이언트 측 인증 (실제 운영시 서버 측 인증 권장)

---

## 📊 데이터 구조

### Firestore 컬렉션: `requests`
```javascript
{
  id: number,                    // 고유 ID
  type: "purchase" | "facility", // 요청 유형
  title: string,                 // 요청 제목
  item: string,                  // 물품명 (구매요청)
  facility: string,              // 시설명 (시설관리)
  quantity: string,              // 수량
  budget: number,                // 예산 (원)
  priority: string,              // 우선순위
  status: string,                // 상태
  requestedBy: string,           // 요청자
  department: string,            // 부서
  reason: string,                // 사유/설명
  location: string,              // 위치 (시설관리)
  quoteFile: object,             // 견적서 파일 정보
  facilityPhotos: array,         // 시설 사진 데이터
  createdAt: string,             // 생성일시 (ISO)
  updatedAt: string,             // 수정일시 (ISO)
  firebaseId: string             // Firebase 문서 ID
}
```

---

## 🚀 배포 방법

### 🥇 GitHub Pages (무료, 추천)
```bash
# 1. GitHub 리포지토리 생성
# 2. 통합요청시스템.html → index.html로 이름 변경
# 3. 모든 파일을 GitHub에 업로드
# 4. Settings → Pages → Source: main branch
# 5. 배포 완료: https://username.github.io/repository-name
```

### 🥈 Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### 🥉 Netlify
1. [Netlify](https://netlify.com)에서 "Deploy manually"
2. 프로젝트 폴더를 드래그 & 드롭
3. 자동 배포 완료

---

## 🔧 커스터마이징

### 디자인 변경
```css
/* 메인 색상 변경 */
:root {
  --primary-color: #3b82f6;    /* 파란색 → 원하는 색으로 변경 */
  --success-color: #22c55e;    /* 초록색 */
  --warning-color: #f59e0b;    /* 주황색 */
  --error-color: #ef4444;      /* 빨간색 */
}
```

### 관리자 계정 변경
```javascript
// adminLogin 함수에서 수정
if (username === 'admin' && password === 'admin123') {
  // → 원하는 계정 정보로 변경
}
```

### 부서 목록 수정
```javascript
// autocompleteData 객체에서 수정
departments: ['IT팀', '마케팅팀', '총무팀', '인사팀', '영업팀', '기획팀']
// → 조직에 맞는 부서명으로 변경
```

---

## 📈 성능 최적화

### 로딩 성능
- **Service Worker**: 정적 리소스 캐싱으로 빠른 로딩
- **CDN 사용**: Firebase SDK 및 SheetJS CDN 활용
- **이미지 최적화**: 아이콘 파일 크기 최소화

### 데이터베이스 성능
- **인덱싱**: Firestore 자동 인덱싱 활용
- **실시간 리스너**: 필요한 데이터만 구독
- **캐싱**: 로컬 스토리지 백업으로 오프라인 지원

### 메모리 최적화
- **이벤트 리스너 정리**: 컴포넌트 제거 시 리스너 해제
- **대용량 파일 처리**: 파일 크기 제한 및 압축

---

## 🧪 테스트

### 기능 테스트
- [ ] 구매 요청 등록 및 파일 업로드
- [ ] 시설 관리 요청 등록 및 사진 업로드
- [ ] 관리자 로그인 및 상태 변경
- [ ] Excel 내보내기 기능
- [ ] 고급 검색 및 필터링

### 브라우저 호환성
- ✅ Chrome (권장)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Internet Explorer (제한적 지원)

### 모바일 테스트
- ✅ iOS Safari
- ✅ Android Chrome
- ✅ 삼성 인터넷
- ✅ PWA 설치 및 오프라인 기능

---

## 🔍 문제 해결

### 자주 발생하는 문제

#### Firebase 연결 실패
```
증상: "Firebase project not found" 오류
해결: firebase-setup.md의 설정 가이드 참고
```

#### PWA 설치 안됨
```
증상: 설치 버튼이 나타나지 않음
해결: HTTPS 환경에서 테스트 (localhost 또는 배포된 사이트)
```

#### 파일 업로드 실패
```
증상: 견적서나 사진 업로드가 안됨
해결: 파일 크기 (10MB 이하) 및 형식 확인
```

#### 실시간 동기화 안됨
```
증상: 다른 사용자의 변경사항이 반영되지 않음
해결: 브라우저 콘솔에서 Firebase 오류 확인
```

---

## 🛠️ 개발 로드맵

### 현재 버전 (v1.0.0)
- ✅ 기본 요청 관리 기능
- ✅ Firebase 실시간 동기화
- ✅ PWA 지원
- ✅ 고급 검색 및 필터링
- ✅ Excel 내보내기

### 향후 계획 (v1.1.0)
- 🔄 이메일 알림 시스템 개선
- 🔄 공급업체 관리 시스템
- 🔄 대시보드 차트 및 통계
- 🔄 모바일 푸시 알림
- 🔄 다국어 지원

### 장기 계획 (v2.0.0)
- 📅 결재 워크플로우
- 👥 다중 사용자 권한 관리
- 📊 고급 리포팅 시스템
- 🔐 SSO(Single Sign-On) 연동
- 🤖 AI 기반 요청 분류

---

## 👥 기여하기

### 개발 환경 설정
```bash
# 1. 프로젝트 클론
git clone <repository-url>
cd purchase-request-system

# 2. 브랜치 생성
git checkout -b feature/new-feature

# 3. 개발 및 테스트
# ... 코드 수정 ...

# 4. 커밋 및 푸시
git add .
git commit -m "feat: 새로운 기능 추가"
git push origin feature/new-feature

# 5. Pull Request 생성
```

### 코딩 스타일
- **함수명**: camelCase (예: `submitPurchaseRequest`)
- **변수명**: camelCase (예: `isFirebaseConnected`)
- **상수명**: UPPER_SNAKE_CASE (예: `MAX_RETRY_COUNT`)
- **들여쓰기**: 4 spaces
- **주석**: 한글로 상세 설명

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자유롭게 사용, 수정, 배포할 수 있습니다.

---

## 📞 지원 및 문의

### 문서 및 가이드
- [Firebase 설정 가이드](firebase-setup.md)
- [Firebase 공식 문서](https://firebase.google.com/docs)
- [PWA 개발 가이드](https://web.dev/progressive-web-apps/)

### 기술적 문의
- GitHub Issues를 통한 버그 리포트 및 기능 요청
- 이메일: your-email@example.com

---

## 🙏 감사의 말

이 프로젝트는 실제 대학교 및 기업의 요청 관리 업무를 효율화하기 위해 개발되었습니다. 
사용해주시는 모든 분들께 감사드리며, 더 나은 시스템을 위한 피드백을 언제든 환영합니다!

---

**🎯 어디서나 접근 가능한 스마트한 요청 관리, 지금 시작하세요!**

---

*마지막 업데이트: 2024년 12월* 