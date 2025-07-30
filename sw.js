// 통합 요청 관리 시스템 - Service Worker
// 버전 관리
const CACHE_NAME = 'request-system-v1.0.0';
const STATIC_CACHE_NAME = 'request-system-static-v1.0.0';

// 캐시할 리소스들
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // Firebase SDK (CDN)
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js',
  // SheetJS 라이브러리
  'https://unpkg.com/xlsx@0.18.5/dist/xlsx.full.min.js',
  // 아이콘 파일들 (실제 존재하는 경우만)
  '/icon-192.png',
  '/icon-512.png'
];

// 캐시하지 않을 리소스들
const excludeFromCache = [
  '/admin',
  'firebase',
  'firestore'
];

// Service Worker 설치
self.addEventListener('install', event => {
  console.log('🔧 Service Worker 설치 중...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('📦 정적 리소스 캐싱 중...');
        return cache.addAll(urlsToCache.filter(url => url !== '/'));
      })
      .then(() => {
        console.log('✅ Service Worker 설치 완료');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Service Worker 설치 실패:', error);
      })
  );
});

// Service Worker 활성화
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker 활성화 중...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 오래된 캐시 삭제
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
            console.log('🗑️ 오래된 캐시 삭제:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker 활성화 완료');
      return self.clients.claim();
    })
  );
});

// 네트워크 요청 가로채기
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // POST 요청이나 Firebase 관련 요청은 캐시하지 않음
  if (request.method !== 'GET' || 
      excludeFromCache.some(exclude => url.href.includes(exclude))) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then(response => {
        // 캐시에 있으면 캐시된 버전 반환
        if (response) {
          console.log('📦 캐시에서 반환:', request.url);
          return response;
        }
        
        // 캐시에 없으면 네트워크에서 가져오기
        return fetch(request).then(response => {
          // 유효한 응답인지 확인
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // 응답을 복제하여 캐시에 저장
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              // HTML 파일과 중요한 리소스만 캐시
              if (request.url.includes('.html') || 
                  request.url.includes('.js') || 
                  request.url.includes('.css') ||
                  request.url.includes('firebase')) {
                console.log('💾 새 리소스 캐싱:', request.url);
                cache.put(request, responseToCache);
              }
            });
          
          return response;
        }).catch(error => {
          console.error('🌐 네트워크 오류:', error);
          
          // 오프라인 시 기본 HTML 페이지 반환
          if (request.destination === 'document') {
            return caches.match('/index.html').then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // 완전 오프라인 대체 페이지
              return new Response(`
                <!DOCTYPE html>
                <html lang="ko">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>오프라인 - 통합 요청 관리 시스템</title>
                  <style>
                    body { 
                      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                      display: flex; 
                      justify-content: center; 
                      align-items: center; 
                      height: 100vh; 
                      margin: 0; 
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                      color: white;
                      text-align: center;
                    }
                    .offline-container {
                      max-width: 400px;
                      padding: 2rem;
                      background: rgba(255, 255, 255, 0.1);
                      backdrop-filter: blur(10px);
                      border-radius: 20px;
                      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    }
                    .emoji { font-size: 4rem; margin-bottom: 1rem; }
                    h1 { margin: 1rem 0; }
                    p { margin: 0.5rem 0; opacity: 0.9; }
                    .retry-btn {
                      margin-top: 1rem;
                      padding: 0.75rem 1.5rem;
                      background: #3b82f6;
                      color: white;
                      border: none;
                      border-radius: 10px;
                      font-size: 1rem;
                      cursor: pointer;
                      transition: all 0.3s ease;
                    }
                    .retry-btn:hover { background: #2563eb; transform: translateY(-2px); }
                  </style>
                </head>
                <body>
                  <div class="offline-container">
                    <div class="emoji">📱</div>
                    <h1>오프라인 모드</h1>
                    <p>인터넷 연결을 확인해주세요.</p>
                    <p>오프라인에서도 로컬 데이터를 사용할 수 있습니다.</p>
                    <button class="retry-btn" onclick="window.location.reload()">
                      다시 시도
                    </button>
                  </div>
                </body>
                </html>
              `, {
                headers: { 'Content-Type': 'text/html' }
              });
            });
          }
          
          // 다른 리소스의 경우 캐시에서 찾기
          return caches.match(request);
        });
      })
  );
});

// 백그라운드 동기화 (브라우저 지원 시)
self.addEventListener('sync', event => {
  console.log('🔄 백그라운드 동기화:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Firebase와 동기화 시도
      syncWithFirebase()
    );
  }
});

// Firebase와 동기화 함수
async function syncWithFirebase() {
  try {
    console.log('🔥 Firebase 백그라운드 동기화 시도...');
    
    // 로컬 스토리지의 백업 데이터 확인
    const localData = JSON.parse(localStorage.getItem('requests_backup') || '[]');
    
    if (localData.length > 0) {
      console.log('📦 동기화할 로컬 데이터:', localData.length, '개');
      
      // 각 클라이언트에게 동기화 메시지 전송
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'SYNC_LOCAL_DATA',
          data: localData
        });
      });
    }
    
    console.log('✅ 백그라운드 동기화 완료');
  } catch (error) {
    console.error('❌ 백그라운드 동기화 실패:', error);
  }
}

// 푸시 알림 (선택사항)
self.addEventListener('push', event => {
  console.log('🔔 푸시 알림 수신:', event);
  
  const options = {
    body: event.data ? event.data.text() : '새로운 요청이 등록되었습니다.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '확인하기',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: '닫기',
        icon: '/icon-192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('통합 요청 관리 시스템', options)
  );
});

// 알림 클릭 처리
self.addEventListener('notificationclick', event => {
  console.log('🖱️ 알림 클릭:', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    // 앱 열기
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// 메시지 수신 (클라이언트와 통신)
self.addEventListener('message', event => {
  console.log('💬 메시지 수신:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// 에러 처리
self.addEventListener('error', event => {
  console.error('❌ Service Worker 오류:', event.error);
});

// 처리되지 않은 Promise 거부 처리
self.addEventListener('unhandledrejection', event => {
  console.error('❌ 처리되지 않은 Promise 거부:', event.reason);
  event.preventDefault();
});

console.log('🎯 Service Worker 로드 완료 - 버전:', CACHE_NAME); 