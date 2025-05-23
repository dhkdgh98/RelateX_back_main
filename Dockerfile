# 베이스 이미지 지정 (Node.js 18 버전 사용)
FROM node:18

# 작업 디렉토리 생성
WORKDIR /usr/src/app

# package.json과 package-lock.json 복사 (의존성 설치 위해)
COPY package*.json ./

# 의존성 설치
RUN npm install

# 앱 소스 복사
COPY . .

# 환경변수 파일 복사 (선택사항, 필요하면)
# COPY .env .

# 서버 실행 포트 설정 (컨테이너 외부 노출)
EXPOSE 5000

# 앱 실행 명령어
CMD ["node", "server.js"]
