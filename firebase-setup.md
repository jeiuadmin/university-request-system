# 🔥 Firebase 실시간 동기화 설정 가이드

## 📋 목차
1. [Firebase 프로젝트 생성](#1-firebase-프로젝트-생성)
2. [Firestore 데이터베이스 설정](#2-firestore-데이터베이스-설정)
3. [보안 규칙 설정](#3-보안-규칙-설정)
4. [웹 앱 등록](#4-웹-앱-등록)
5. [설정 정보 적용](#5-설정-정보-적용)
6. [배포 방법](#6-배포-방법)

---

## 1. Firebase 프로젝트 생성

### 1단계: Firebase Console 접속
1. [Firebase Console](https://console.firebase.google.com/) 접속
2. Google 계정으로 로그인
3. "프로젝트 추가" 클릭

### 2단계: 프로젝트 설정
```
프로젝트 이름: university-request-system
프로젝트 ID: university-request-system-xxxxx (자동 생성)
Google 애널리틱스: 선택사항 (추천: 활성화)
```

---

## 2. Firestore 데이터베이스 설정

### 1단계: Firestore 생성
1. Firebase Console에서 "Firestore Database" 선택
2. "데이터베이스 만들기" 클릭
3. **테스트 모드**로 시작 (나중에 보안 규칙 설정)
4. 위치 선택: `asia-northeast3 (서울)` 추천

### 2단계: 컬렉션 구조
```
📁 requests (컬렉션)
  📄 문서1 (자동 ID)
    ├── id: number
    ├── type: string ("purchase" | "facility")
    ├── title: string
    ├── item: string
    ├── quantity: string
    ├── budget: number
    ├── priority: string
    ├── status: string
    ├── requestedBy: string
    ├── department: string
    ├── reason: string
    ├── createdAt: string (ISO)
    └── updatedAt: string (ISO)
```

---

## 3. 보안 규칙 설정

Firebase Console → Firestore → 규칙에서 다음 규칙 적용:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // requests 컬렉션 접근 규칙
    match /requests/{document} {
      // 인증된 사용자만 읽기/쓰기 허용
      allow read, write: if request.auth != null;
      
      // 또는 모든 사용자 허용 (내부 시스템용)
      // allow read, write: if true;
    }
  }
}
```

### 권장 보안 설정 (고급)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /requests/{document} {
      // 읽기: 모든 인증 사용자
      allow read: if request.auth != null;
      
      // 생성: 필수 필드 검증
      allow create: if request.auth != null 
        && request.resource.data.keys().hasAll(['type', 'status', 'requestedBy', 'createdAt'])
        && request.resource.data.type in ['purchase', 'facility']
        && request.resource.data.status in ['대기', '진행중', '완료', '취소'];
      
      // 업데이트: 상태 변경만 허용
      allow update: if request.auth != null 
        && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status', 'updatedAt']);
    }
  }
}
```

---

## 4. 웹 앱 등록

### 1단계: 웹 앱 추가
1. Firebase Console → 프로젝트 설정 (⚙️ 아이콘)
2. "앱" 섹션에서 웹 앱 추가 (`</>` 아이콘)
3. 앱 닉네임: `통합요청관리시스템`
4. Firebase Hosting 설정: 선택사항

### 2단계: 설정 정보 복사
다음과 같은 설정 정보가 생성됩니다:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "university-request-system-xxxxx.firebaseapp.com",
  projectId: "university-request-system-xxxxx",
  storageBucket: "university-request-system-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};
```

---

## 5. 설정 정보 적용

### HTML 파일 수정
`통합요청시스템.html` 파일에서 다음 부분을 찾아 교체:

```javascript
// 🔥 이 부분을 교체하세요!
const firebaseConfig = {
    apiKey: "your-api-key-here",           // ← Firebase에서 복사한 실제 값
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

**실제 설정으로 교체 예:**
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "university-request-system-xxxxx.firebaseapp.com",
    projectId: "university-request-system-xxxxx",
    storageBucket: "university-request-system-xxxxx.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdefghijklmnop"
};
```

---

## 6. 배포 방법

### 🥇 방법 1: GitHub Pages (추천)
```bash
# 1. GitHub 리포지토리 생성
# 2. HTML 파일을 index.html로 이름 변경
# 3. GitHub에 업로드
# 4. Repository Settings → Pages → Source: main branch
# 5. 배포 완료: https://username.github.io/repository-name
```

### 🥈 방법 2: Firebase Hosting
```bash
# 1. Firebase CLI 설치
npm install -g firebase-tools

# 2. 로그인
firebase login

# 3. 프로젝트 초기화
firebase init hosting

# 4. 설정
# - 프로젝트 선택: university-request-system-xxxxx
# - public directory: . (현재 폴더)
# - single-page app: No
# - 기존 파일 덮어쓰기: No

# 5. 배포
firebase deploy
```

### 🥉 방법 3: Netlify (간편)
1. [Netlify](https://netlify.com) 가입
2. "Sites" → "Deploy manually"
3. HTML 파일을 드래그 & 드롭
4. 자동 배포 완료

---

## 🔧 주요 기능

### ✅ 실시간 동기화
- 여러 사용자가 동시에 접속해도 실시간으로 데이터 동기화
- 요청 상태 변경 시 모든 사용자에게 즉시 반영

### ✅ 오프라인 지원
- 인터넷 연결이 끊어져도 로컬에 데이터 저장
- 연결 복구 시 자동으로 Firebase와 동기화

### ✅ 자동 백업
- Firebase 저장 실패 시 자동으로 로컬 스토리지에 백업
- 데이터 손실 방지

### ✅ 연결 상태 표시
- 헤더 우상단에 실시간 연결 상태 표시
- 🟢 연결됨 | ✅ 동기화됨 | 🔴 오류 | ⚫ 오프라인

---

## 🔒 보안 고려사항

### 권장 사항
1. **도메인 제한**: Firebase Console에서 승인된 도메인만 설정
2. **API 키 보호**: 민감한 데이터가 없는 시스템이므로 클라이언트 키 사용 가능
3. **사용량 모니터링**: Firebase Console에서 정기적으로 사용량 확인

### API 키 관리
- Firebase 웹 API 키는 공개되어도 안전함 (클라이언트용)
- 보안은 Firestore 규칙으로 제어
- 실제 민감한 작업은 Firebase Functions 활용 권장

---

## 📊 사용량 확인

### Firebase Console 모니터링
- **Firestore**: 읽기/쓰기 횟수
- **Authentication**: 인증 사용자 수
- **Hosting**: 트래픽 및 저장 용량

### 무료 할당량 (Spark 플랜)
```
Firestore:
- 읽기: 50,000회/일
- 쓰기: 20,000회/일
- 삭제: 20,000회/일
- 저장 용량: 1GB

Authentication:
- 익명 인증: 무제한

Hosting:
- 저장 용량: 10GB
- 전송량: 360MB/일
```

---

## 🚨 문제 해결

### 일반적인 오류들

#### 1. "Firebase project not found"
```
해결: Firebase Console에서 프로젝트 ID 확인 후 수정
```

#### 2. "Permission denied"
```
해결: Firestore 보안 규칙 확인
- 테스트 모드로 변경 또는
- 익명 인증 허용 규칙 추가
```

#### 3. "Failed to load Firebase SDK"
```
해결: 인터넷 연결 확인 또는 CDN URL 점검
```

#### 4. 실시간 동기화 안됨
```
해결: 브라우저 콘솔에서 오류 메시지 확인
- F12 → Console 탭에서 Firebase 관련 오류 찾기
```

---

## 🎉 배포 완료 체크리스트

- [ ] Firebase 프로젝트 생성
- [ ] Firestore 데이터베이스 설정
- [ ] 보안 규칙 적용
- [ ] 웹 앱 등록 및 설정 정보 복사
- [ ] HTML 파일의 firebaseConfig 교체
- [ ] 웹 호스팅 서비스에 배포
- [ ] 실시간 동기화 테스트
- [ ] 다중 사용자 테스트
- [ ] 오프라인 모드 테스트

---

## 📞 지원

문제가 발생하면 다음 리소스를 참고하세요:

- [Firebase 공식 문서](https://firebase.google.com/docs)
- [Firestore 시작 가이드](https://firebase.google.com/docs/firestore/quickstart)
- [Firebase 커뮤니티](https://firebase.google.com/community)

---

**🎯 이제 어디서나 접근 가능한 실시간 통합 요청 관리 시스템이 완성되었습니다!** 